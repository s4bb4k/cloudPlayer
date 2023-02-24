class AudioPlayer {

    constructor(params) {
        this.songs = [];
        this.queue = [];
        this.player = new Audio();
        const src = "songs/Emarosa_Sure.mp3";

        this._gui = {
            progressBar: { value: undefined, DOMElement: undefined },
            artistName: { value: undefined, DOMElement: undefined },
            songName: { value: undefined, DOMElement: undefined },
            currentTime: { value: undefined, DOMElement: undefined },
            totalTime: { value: undefined, DOMElement: undefined },
            albumCover: { value: undefined, DOMElement: undefined },
        }

        if (params.hasOwnProperty("gui")) {
            const { progressBar, artistName, songName, currentTime, totalTime, albumCover } = params.gui;
            this._initGUI(progressBar, artistName, songName, currentTime, totalTime, albumCover);
        }

        this._buttons = {
            queue: undefined,
            volume: undefined,
            back: undefined,
            playPause: undefined,
            next: undefined,
            add: undefined
        };

        this._loadSong(src);

        if (params.hasOwnProperty("buttons")) {
            const { queue, volume, back, playPause, next, add } = params.buttons;
            this._initButtons(queue, volume, back, playPause, next, add);
        }
    }

    _loadSong(src) {
        this.player.src = src;
        this.player.onloadedmetadata = () => {
            this.gui = {
                totalTime: { value: this.player.duration, DOMElement: this.gui.totalTime.DOMElement },
                currentTime: { value: 0, DOMElement: this.gui.currentTime.DOMElement },
            }
        }
        this.player.ontimeupdate = () => {
            this.gui = {
                currentTime: { ...this.gui.currentTime, value: this.player.currentTime }
            };
            const [tt,ct] = [this.gui.totalTime.value, this.gui.currentTime.value];
            const progress = (ct / tt) * 100;
            const pBar = this.gui.progressBar.DOMElement.querySelector("div");
            pBar.style.width = `${progress}%`;
        }
        this.player.volume = 0.05;
    }

    _initButtons(...params) {
        this.buttons = {
            queue: params[0] || undefined,
            volume: params[1] || undefined,
            back: params[2] || undefined,
            playPause: params[3] || undefined,
            next: params[4] || undefined,
            add: params[5] || undefined,
        }

    }

    _initGUI(...params) {
        this.gui = {
            progressBar: params[0] || { value: undefined, DOMElement: undefined},
            artistName: params[1] || { value: undefined, DOMElement: undefined},
            songName: params[2] || { value: undefined, DOMElement: undefined},
            currentTime: params[3] || { value: undefined, DOMElement: undefined},
            totalTime: params[4] || { value: undefined, DOMElement: undefined},
            albumCover: params[5] || { value: undefined, DOMElement: undefined},
        }
    }

    _addClickEvent(element, callback) {
        console.log("DEBUG", element, callback)
        if (element instanceof HTMLElement) {
            element.onclick = callback;
        } else {
            if (element.hasOwnProperty("DOMElement")) {
                element = element.DOMElement;
                if (element instanceof HTMLElement) {
                    element.onclick = callback;
                }
            }
        }
    }

    _assignValues(toAssign, elements, actions = []) {
        const keys = Object.keys(elements);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (elements[key] !== undefined) {
                toAssign[key] = elements[key];
                if (Object.keys(actions).length > 0) {
                    if (actions.hasOwnProperty(key)) {
                        this._addClickEvent(toAssign[key], actions[key]);
                    }
                }
            }
        }
    }

    _setToMinsSecond(time){
        var time    = parseInt(time);
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        var hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        let finalTime = this._str_pad_left(minutes,'0',2)+':'+this._str_pad_left(seconds,'0',2);
        return finalTime;
    }
    _str_pad_left(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    }

    _updateGUIElement(el) {
        if (el.DOMElement instanceof HTMLElement) {
            el.DOMElement.innerHTML = this._setToMinsSecond(el.value);
        }
    }

    _updateTextGUIElement(el) {
        if (el.DOMElement instanceof HTMLElement) {
            el.DOMElement.innerHTML = el.value;
        }
    }

    set gui(elements) {
        // calcular progressBar
        const actions = {
            progressBar: (e) => {
                const x = e.offsetX;
                const w = this.gui.progressBar.DOMElement.offsetWidth;
                const newCurrentTime = this.gui.totalTime.value * (x/w);
                this.player.currentTime = newCurrentTime;
                this.gui = {
                    currentTime: {value: newCurrentTime, DOMElement: this.gui.currentTime.DOMElement }
                };
            }
        }
        // asignación de valores
        this._assignValues(this._gui, elements, actions);
        // actualización de elementos
        this._updateGUIElement(this.gui.totalTime);
        this._updateGUIElement(this.gui.currentTime);
        this._updateTextGUIElement(this.gui.songName);
        this._updateTextGUIElement(this.gui.artistName);
    }

    get gui() {
        return this._gui;
    }

    _toggleIcon(el, aClass, bClass) {
        const i = el.querySelector("i");
        if (!i.classList.contains(aClass)) {
            i.classList.remove(bClass);
            i.classList.add(aClass);
        } else {
            i.classList.remove(aClass);
            i.classList.add(bClass);
        }
        
    }

    set buttons(btns) {
        const actions = {
            playPause: () => {
                if (this.player.paused) {
                    this.player.play();
                } else {
                    this.player.pause();
                }
                this._toggleIcon(this.buttons.playPause, "fa-play", "fa-pause");
            }
        }
        this._assignValues(this._buttons, btns, actions);
    }

    get buttons() {
        return this._buttons;
    }
}