import { Component, OnInit } from '@angular/core';
import { Gamelogic } from '../gamelogic';
declare var $: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [Gamelogic]
})
export class GameComponent implements OnInit {

  seleccionado: boolean;
  opcion: string;
  listaOpcion: string[] = ["CPU", "VERSUS"];

  constructor(public game: Gamelogic) {
    this.opcion = this.listaOpcion[0];
  }

  ngOnInit(): void { }

  startGame(): void {
    this.game.gameStart();
    const currentPlayer = 'Turno actual: Player: ' + this.game.currentTurn;
    const information = document.querySelector('.current-status');
    information.innerHTML = currentPlayer;
    this.seleccionado = false;
    $("#clon").empty();
    //console.log(this.opcion);
  }

  async procesoSubfield(imagen: any): Promise<void> {
    const information = document.querySelector('.current-status');
    const avatarItem = document.getElementById(imagen);
    avatarItem.style.visibility = 'hidden';
    this.game.avatarSelect = "none";
    this.seleccionado = true;

    await this.game.checkGameEndWinner().then((end: boolean) => {
      if (this.game.gameStatus === 0 && end) {
        information.innerHTML = 'El ganador es Player. ' + (this.opcion === this.listaOpcion[0] && this.game.currentTurn === 2 ? 'CPU' : this.game.currentTurn);
       
        $("#gameboard").clone(true).appendTo("#clon");
      }
    });

    await this.game.checkGameEndFull().then((end: boolean) => {
      if (this.game.gameStatus === 0 && end) {
        information.innerHTML = 'No hay ganador, empate';

        $("#gameboard").clone(true).appendTo("#clon");
      }
    });

    this.game.changePlayer();

    if (this.game.gameStatus === 1) {
      if (this.game.avatarSelect === "none") {
        const currentPlayer = 'Player: ' + (this.game.currentTurn === 1 ? 2 : 1) + ' Seleccione una ficha para el contrincante ';
        information.innerHTML = currentPlayer;
      }

    }
  }

  async clickSubfield(subfield: any): Promise<void> {
    if (this.game.gameStatus === 1 && this.game.avatarSelect !== "none") {
      const position = subfield.currentTarget.getAttribute('position');
      this.game.setField(position, this.game.avatarSelect);
      const imagen = this.game.getPlayerImagenClass();
      subfield.currentTarget.classList.add(imagen);
      this.procesoSubfield(imagen);
    }

  }

  async clickSubfieldCPU(subfield: any, position: number): Promise<void> {
    if (this.game.gameStatus === 1 && this.game.avatarSelect !== "none") {
      this.game.setField(position, this.game.avatarSelect);
      const imagen = this.game.getPlayerImagenClass();
      subfield.classList.add(imagen);
      this.procesoSubfield(imagen);
    }
  }

  async procesoSubAvatar(): Promise<void> {
    const currentPlayer = 'Turno actual: Player: ' + (this.opcion === this.listaOpcion[0] ? 1 : this.game.currentTurn);
    const information = document.querySelector('.current-status');
    information.innerHTML = currentPlayer;
    this.seleccionado = false;

    const pos = this.game.avatarList.indexOf(this.game.avatarSelect);
    this.game.avatarList.splice(pos, 1);
  }

  async clickSubAvatar(subavatar: any): Promise<void> {
    if (this.game.gameStatus === 1) {
      const avatar = subavatar.currentTarget.getAttribute('avatar');
      this.game.avatarSelect = avatar;
      this.procesoSubAvatar();
      if (this.opcion === this.listaOpcion[0]) this.procesoCPU();
    }
  }

  async clickSubAvatarCPU(): Promise<void> {
    const p = Math.floor(Math.random() * this.game.avatarList.length) + 1;
    const avatar = this.game.avatarList[p - 1];
    this.game.avatarSelect = avatar;
    this.procesoSubAvatar();
  }

  async procesoCPU(): Promise<void> {
    let bandera = true;
    let pos=0;
    while (bandera) {
      pos = Math.floor(Math.random() * this.game.gameField.length) + 1;
      pos--;
      if (this.game.gameField[pos] === '0') {
        bandera = false;
      }
    }

    //const pos = this.game.gameField.indexOf("0");
    const subfield = document.getElementById("position-" + pos);
    this.clickSubfieldCPU(subfield, pos);
    this.clickSubAvatarCPU();

  }

}
