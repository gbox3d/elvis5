export default class gameObject {

    constructor({engine, entity}) {
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

    _addScript(_script) {
        const _codeObj = (new Function('engine', _script)).bind(this)(this.engine);

        this._update = _codeObj.update;
        this._start = _codeObj.start;
        
    }

    async addScriptFromUrl(url) {

        const _script = await (await fetch(url)).text();
        this._addScript(_script);
        
    }

    async addScriptFromFileID({fileID,repo_address=''}) {


        try {
            const _script = await (await fetch(`${repo_address}/com/file/download/pub/${fileID}`)).text();
            this._addScript(_script);
            // return true;
        }
        catch (e) {
            console.log(e);
            return e
        }
            

        // let res = await (await (fetch(`/com/file/findOne/${fileID}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/text',
        //         'authorization': localStorage.getItem('jwt_token')
        //     }
        // }))).json();
        // console.log(res)

        // if (res.r === 'ok' && res.data ) {

            

        //     return true
        // }

        // return false
        
    }
    
}