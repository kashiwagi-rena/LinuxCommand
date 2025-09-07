/**
 * Linuxのcatコマンドの作成
 * [Deno公式](https://docs.deno.com/examples/unix_cat/)に載っていたので、ちょっと改良
 */
for (const filename of Deno.args) {
    const file = await Deno.open(filename);
    console.log("@@@@@", file);
    await file.readable.pipeTo(Deno.stdout.writable, { preventClose: true });
}