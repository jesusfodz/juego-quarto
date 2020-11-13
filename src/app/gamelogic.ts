import { Status } from "./gamestatus";

export class Gamelogic {

    gameField: Array<string> = [];
    avatarList: Array<string> = [];
    auxList: Array<string> = ['a', 'b', 'c', 'd'];

    currentTurn: number;

    avatarSelect: string;

    gameStatus: Status;

    control: Array<boolean>=[];

    winCombinaciones: Array<Array<string>> = [];

    public constructor() {
        this.gameStatus = Status.STOP;
        this.gameField = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
        this.avatarList = ["0000", "0001", "0010", "0011", "1000", "1001", "1010", "1011", "0100", "0101", "0110", "0111", "1100", "1101", "1110", "1111"];

        let winAltas: Array<string> = ["1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
        let winBajas: Array<string> = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111"];
        let winHueco: Array<string> = ["0001", "0011", "1001", "1011", "0101", "0111", "1101", "1111"];
        let winCuadradas: Array<string> = ["0000", "0001", "1000", "1001", "0100", "0101", "1100", "1101"];
        let winRedondas: Array<string> = ["0010", "0011", "1010", "1011", "0110", "0111", "1110", "1111"];
        let winOscuras: Array<string> = ["0100", "0101", "0110", "0111", "1100", "1101", "1110", "1111"];
        let winClaras: Array<string> = ["0000", "0001", "0010", "0011", "1000", "1001", "1010", "1011"];

        this.generarPermutacionNoSust(winAltas, this.auxList, 4);
        this.generarPermutacionNoSust(winBajas, this.auxList, 4);
        this.generarPermutacionNoSust(winHueco, this.auxList, 4);
        this.generarPermutacionNoSust(winCuadradas, this.auxList, 4);
        this.generarPermutacionNoSust(winRedondas, this.auxList, 4);
        this.generarPermutacionNoSust(winOscuras, this.auxList, 4);
        this.generarPermutacionNoSust(winClaras, this.auxList, 4);

    }

    generarPermutacionNoSust(a: Array<string>, b: Array<string>, cantidad: number): void {
        if (cantidad === 0) {
            this.winCombinaciones.push(Array.from(new Set(b)));
        }
        else {
            for (let i = 0; i < a.length; i++) {
                if (this.control[i] === true) continue;
                this.control[i] = true;
                b[b.length - cantidad] = a[i];
                this.generarPermutacionNoSust(a, b, cantidad - 1);
                this.control[i] = false;
            }
        }

    }

    gameStart(): void {
        this.avatarList = ["0000", "0001", "0010", "0011", "1000", "1001", "1010", "1011", "0100", "0101", "0110", "0111", "1100", "1101", "1110", "1111"];
        const startSelect = Math.floor(Math.random() * 16) + 1;
        this.avatarSelect = this.avatarList[startSelect - 1];
        let pos=this.avatarList.indexOf(this.avatarSelect);
        this.avatarList.splice(pos,1);

        this.gameField = this.gameField = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
        this.currentTurn = this.randonPlayerStart();
        this.gameStatus = Status.START;

        //console.log(this.winCombinaciones);
    }

    randonPlayerStart(): number {
      //  const startPlayer = Math.floor(Math.random() * 2) + 1;
      const startPlayer = 1;
        return startPlayer;
    }

    setField(position: number, value: string): void {
        this.gameField[position] = value;
        //console.log(this.gameField);
    }

    getPlayerImagenClass(): string {
        const imagenClass = 'avatar-' + this.avatarSelect;
        return imagenClass;
    }

    changePlayer(): void {
        this.currentTurn = (this.currentTurn === 2) ? 1 : 2;
    }

    arrayEquals(a: Array<any>, b: Array<any>): boolean {
        // console.log( a.length +"..."+ b.length );
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
            a.every((value, index) => value === b[index]);
    }

    async checkGameEndWinner(): Promise<boolean> {
        let isWinner = false;

        const checkarray = this.winCombinaciones;

        //console.log(checkarray);

        const currentarray = [
            [this.gameField[0], this.gameField[1], this.gameField[2], this.gameField[3]],
            [this.gameField[4], this.gameField[5], this.gameField[6], this.gameField[7]],
            [this.gameField[8], this.gameField[9], this.gameField[10], this.gameField[11]],
            [this.gameField[12], this.gameField[13], this.gameField[14], this.gameField[15]],

            [this.gameField[0], this.gameField[4], this.gameField[8], this.gameField[12]],
            [this.gameField[1], this.gameField[5], this.gameField[9], this.gameField[13]],
            [this.gameField[2], this.gameField[6], this.gameField[10], this.gameField[14]],
            [this.gameField[3], this.gameField[7], this.gameField[11], this.gameField[15]],

            [this.gameField[0], this.gameField[5], this.gameField[10], this.gameField[15]],
            [this.gameField[3], this.gameField[6], this.gameField[9], this.gameField[12]],
        ];

        //  this.gameField.forEach((subfield, index) => {
        // if(subfield !== this.currentTurn){
        //     currentarray[index]=0;
        // }else{
        //currentarray[index] = subfield;
        // }
        //  });

        //console.log(". "+currentarray[0]);
        //console.log(".. " + this.winCombinaciones[0]);
        currentarray.forEach((checkfield1, checkindex1) => {
            checkarray.forEach((checkfield2, checkindex2) => {
                if (this.arrayEquals(checkfield2, checkfield1)) {
                    isWinner = true;
                }
            });
        });

        if (isWinner) {
            this.gameEnd();
            return true;
        } else {
            return false;
        }
    }

    async checkGameEndFull(): Promise<boolean> {
        let isFull = true;

        if (this.gameField.includes('0')) {
            isFull = false;
        }

        if (isFull) {
            this.gameEnd();
            return true;
        } else {
            return false;
        }
    }

    gameEnd(): void {
        this.gameStatus = Status.STOP;
    }


}
