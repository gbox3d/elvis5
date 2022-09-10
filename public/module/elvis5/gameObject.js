export default class gameObject {

    constructor({ engine, entity }) {
        this.engine = engine;
        this.entity = entity;
        this.entity.gameObject = this;

    }

    start() {
        // console.log("start");
        this._start ? this._start() : null;

    }

    update(event) {
        // console.log("update");
        this._update ? this._update(event) : null;
    }

    _setScript(_script) {
        const _codeObj = (new Function('engine', _script)).bind(this)(this.engine);

        this._update = _codeObj.update;
        this._start = _codeObj.start;

    }

    async setScriptFromUrl(url) {

        try {
            this.scriptFileUrl = url;
            const _script = await (await fetch(url)).text();
            this._setScript(_script);

            return {
                r: 'ok',
                script : _script
            }

        }
        catch (e) {
            return {
                error: e,
                r: 'error'
            }
        }

    }

    async setScriptFromFileID({ fileID, repo_address = '' }) {

        try {
            const _script = await (await fetch(`${repo_address}/com/file/download/pub/${fileID}`)).text();
            this.scriptFileId = fileID;
            this._setScript(_script);
            return {
                r: 'ok',
                script: _script
            }
        }
        catch (e) {
            console.log(e);
            return {
                error: e,
                r: 'error'
            }
        }
    }

    removeScript() {
        this._update = null;
        this._start = null;
    }

}