const MsgBar = {
    _msgBar: document.querySelector('#msg-bar'),
    infoBg: '#FF8C00',
    warnBg: '#C0C0C0',
    succBg: '#00BFFF',
    show(msg, bg) {
        this._msgBar.innerHTML = msg
        this._msgBar.style.background = bg
        if (!this._msgBar.classList.contains('msg-bar-active')) {
            this._msgBar.classList.add('msg-bar-active')
        }
        setTimeout(() => {
            if (this._msgBar.classList.contains('msg-bar-active'))
                this._msgBar.classList.remove('msg-bar-active')
        }, 3000)
    },
    display(type, msg) {
        this._msgBar.innerHTML = msg
        switch (type) {
            case "info": {
                this._msgBar.style.background = this.infoBg
            } case "warn": {
                this._msgBar.style.background = this.warnBg
            } case "success": {
                this._msgBar.style.background = this.succBg
            } default: {
                console.error('Type string must be one of "info" "warn" or "success"')
                this._msgBar.style.background = this.infoBg
            }
        }
        if (!this._msgBar.classList.contains('msg-bar-active')) {
            this._msgBar.classList.add('msg-bar-active')
        }
    },
    close() {
        this._msgBar.classList.remove('msg-bar-active')
    },
    info(msg) {
        this.show(msg, this.infoBg)
    },
    warn(msg) {
        this.show(msg, this.warnBg)
    },
    error(msg) {
        this.show(msg, this.warnBg)
    },
    sucess(msg) {
        this.show(msg, this.succBg)
    }
}
module.exports = MsgBar