import type { Color } from "$lib/stores/stateStore"

function createColor(name: string, bg: string, border: string) {
    return {name: name, bg: bg, border: border}
}

export let colors = [
    createColor("red", "mainRed", "[borderRed]"),
    createColor("orange","mainOrange", "orange-800"),
    createColor("yellow", "amber-400", "amber-700"),
    createColor("lime", "lime-500", "lime-800"),
    createColor("green", "green-500", "green-800"),
    createColor("teal", "teal-400", "teal-700"),
    createColor("brown", "yellow-900", "amber-950"),
    createColor("blue", "blue-500", "blue-800"),
    createColor("purple", "purple-500", "purple-800"),
    createColor("pink", "pink-500", "pink-800"),
/*
    createColor("red","mainRed","borderRed"),
    createColor("","","borderOrange"),
    createColor("","","borderYellow"),
    createColor("","","borderLime"),
    createColor("","","borderGreen"),
    createColor("","","borderTeal"),
    createColor("","","borderBrown"),
    createColor("","","borderBlue"),
    createColor("","","borderPurple"),
    createColor("","","borderPink"),
*/
]