import type { BoardId, Color, CommandId, Svg, User, Username } from '$lib/types';
import { writable, get } from 'svelte/store';
import { io, Socket } from 'socket.io-client';
import type {
	ClientToServerEvents,
	ServerToClientEvents,
	InitServerToClientEvents,
	UserChangeEvent,
	UserRemoveEvent,
	EditEvent,
	RemoveEvent
} from '$lib/socketioInterface';
import { username } from './stateStore';
import {
	PUBLIC_SOCKET_API_PROTOCOL,
	PUBLIC_SOCKET_API_HOSTNAME,
	PUBLIC_SOCKET_API_PORT
} from '$env/static/public';
const SOCKET_ENDPOINT: string = `${PUBLIC_SOCKET_API_PROTOCOL}://${PUBLIC_SOCKET_API_HOSTNAME}:${PUBLIC_SOCKET_API_PORT}`;
export const initSocket = writable<Socket<InitServerToClientEvents> | null>(null);
export const boardSocket = writable<Socket<ServerToClientEvents, ClientToServerEvents> | null>(
	null
);
export const otherUsers = writable<Map<Username, User>>(new Map());
export const svgs = writable<Map<CommandId, Svg>>(new Map());

export function connectToBoardSocket(
	username: Username,
	color: Color,
	boardId: BoardId,
	successCallback: () => void
) {
	boardSocket.set(
		io(SOCKET_ENDPOINT + `/${boardId}`, {
			auth: {
				username: username,
				color: color
			}
		})
	);
	get(boardSocket)?.on('userChange', handleUserChange);
	get(boardSocket)?.on('userRemove', handleUserRemove);
	get(boardSocket)?.on('edit', handleEdit);
	get(boardSocket)?.on('remove', handleRemove);
	get(boardSocket)?.on('connect', () => {
		get(boardSocket)?.off('connect');
		successCallback();
	});
}

export function connectToInitSocket(boardId: BoardId, successCallback: () => void) {
	initSocket.set(io(SOCKET_ENDPOINT + `/${boardId}_init`));
	get(initSocket)?.on('userChange', handleUserChange);
	get(initSocket)?.on('userRemove', handleUserRemove);
	get(initSocket)?.on('connect', () => {
		get(initSocket)?.off('connect');
		successCallback();
	});
}

function handleUserChange(data: UserChangeEvent) {
	otherUsers.update((current) => {
		if (data.username === get(username)) return current;
		const oldUser = current.get(data.username)!;
		current.set(data.username, {
			name: data.username,
			color: data.color ?? oldUser.color,
			position: data.position ?? oldUser.position
		});
		return current;
	});
}

function handleUserRemove(data: UserRemoveEvent) {
	otherUsers.update((current) => {
		current.delete(data.username);
		return current;
	});
}

function handleEdit(data: EditEvent) {
	svgs.update((current) => {
		const oldSvg = current.get(data.commandId)!;
		current.set(data.commandId, {
			commandId: data.commandId,
			svgString: data.svgString ?? oldSvg.svgString,
			position: data.position ?? oldSvg.position,
			display: true
		});
		return current;
	});
}

function handleRemove(data: RemoveEvent) {
	svgs.update((current) => {
		if (!current.has(data.commandId)) return current;
		const oldSvg = current.get(data.commandId)!;
		current.set(data.commandId, {
			...oldSvg,
			display: false
		});
		return current;
	});
}
