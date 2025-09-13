console.log(Deno.args);
const options = Deno.args[0];
console.log("@@@@@", options);

/**
 * Deno.argsで、文字列が入っていない場合に、エラー文が出る仕様
 */
if (Deno.args.length === 0) {
    console.error("使用方法： deno run --allow-write touch.ts <ファイル名>");
    Deno.exit(1);
}
/**
 * touchコマンドのオプション"-a"を追加
 */
if (options === "-a"){
    const args1 = Deno.args[1];

    if (args1 === "-t"){
        const { time } = Deno.args[2];
        const path = Deno.args[3];
        try{
            const { mtime } = await Deno.stat(path);
            await Deno.utime(path, new Date(), Number(time));
        }catch(_e){
            const newFile = await Deno.create(path);
            newFile.close();
        }    
    }

    const { mtime } = await Deno.stat(args1);
    await Deno.utime(args1, new Date(), mtime ?? new Date());

    try{
        const info = await Deno.stat(args1);
        await Deno.utime(args1, new Date(), info.mtime ?? new Date());
    }catch(_e){
        const newFile = await Deno.create(args1);
        newFile.close();
    }
}

/**
 * touchコマンドのオプション"-m"を追加
 */
if (options === "-m"){
    const args1 = Deno.args[0];
    if (args1 === "-t"){
        const path = Deno.args[1];
        try{
            const info = await Deno.stat(path);
            await Deno.utime(path, info.mtime ?? new Date(), new Date());
        }catch(_e){
            const newFile = await Deno.create(path);
            newFile.close();
        }    
    }
    try{
        const info = await Deno.stat(args1);
        await Deno.utime(args1, info.mtime ?? new Date(), new Date());
    }catch(_e){
        const newFile = await Deno.create(args1);
        newFile.close();
    }
}

/**
 * touchコマンドのオプション"-t"を追加
 */
if (options === "-t"){
    try{
        const info = new Date(Deno.args[1]);
        const path = Deno.args[2];
        await Deno.utime(path, info, info);
    }catch(_e){
        console.error("使用方法： deno run --allow-write touch.ts -t <時刻> <ファイル名>");
    }
}

/**
 * touchコマンドのオプション"-r"を追加
 */
if (options === "-r"){
    try{
        const src = Deno.args[1];
        const dst = Deno.args[2];
    
        const srcInfo = await Deno.stat(src);
    
        await Deno.utime(dst, srcInfo.mtime ?? new Date(), srcInfo.atime ?? new Date());
    } catch(_e) {
        console.error("使用方法： deno run --allow-write touch.ts -r <src> <dst>");
    }
}



for (const filename of Deno.args) {
    /**
     * touchコマンドのオプション"-c"を追加
     */
    if (filename === "-c"){
        Deno.exit(1);
    }
    /**
     * 空のファイル作成
     */
    try{
        await Deno.stat(filename);
        console.log("ファイルが存在します");
    }catch(_e){
        const file = await Deno.create(filename);
        file.close();
    }
}