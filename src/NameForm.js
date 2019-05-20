import React, {
    Component
} from 'react';
import './index.css';

class NameForm extends Component {
    constructor(props) {
        super(props);
        this.storeValues = this.storeValues.bind(this);
        this.normalsChange = this.normalsChange.bind(this);
        this.chiefsChange = this.chiefsChange.bind(this);
        this.onlyMorningsChange = this.onlyMorningsChange.bind(this);
        this.onlyMorningsNoWeekendsChange = this.onlyMorningsNoWeekendsChange.bind(this);
        this.state = {
            chiefs: 5,
            normals: 20,
            onlyMornings: 2,
            onlyMorningsNoWeekends: 2
        };
    }

    async storeValues() {
        console.log("Starting fetch");
        const response = await fetch('http://' + window.location.hostname + ':3100/', {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state)
            });
        const text = await response.json();
        this.setState({
            resposta: text
        });
        console.log("Finalizing fetch, text = " + text);
    }

    normalsChange(e) {
        this.setState({
            normals: e.target.value
        });
    }

    chiefsChange(e) {
        this.setState({
            chiefs: e.target.value
        });
    }

    onlyMorningsChange(e) {
        this.setState({
            onlyMornings: e.target.value
        });
    }

    onlyMorningsNoWeekendsChange(e) {
        this.setState({
            onlyMorningsNoWeekends: e.target.value
        });
    }

    createCalendar() {
        let table = [];
        let respostaParts = [];
        var resposta = this.state.resposta;
        let respostaTransformadaChefes = [];
        let respostaTransformadaNormais = [];
        let respostaTransformadaManhas = [];
        let respostaTransformadaManhasSemFds = [];
        console.log("logar a resposta:");
        console.log(resposta);
	if (!resposta) {
		return;
        }
        respostaParts = JSON.parse(resposta);
        console.log("Reposta parse:");
        console.log(respostaParts);
	if (!!respostaParts.error) {
		alert("Não foi possível encontrar um horário compatível. Exprimente aumentar o número de enfermeiros");
		return;
	}

        /* traduzir numeros para letras */
        for (var i = 0; i < respostaParts.chiefs.length; i++) {
            let respostaAux = [];
            for (var j = 0; j < 8; j++) {
                if (respostaParts.chiefs[i][j] === 0) {
                    respostaAux.push("F");
                } else if (respostaParts.chiefs[i][j] === 1) {
                    respostaAux.push("M");
                } else if (respostaParts.chiefs[i][j] === 2) {
                    respostaAux.push("T");
                } else if (respostaParts.chiefs[i][j] === 3) {
                    respostaAux.push("N");
                }
            }
            respostaTransformadaChefes.push(respostaAux);
        }

        for (var i = 0; i < respostaParts.normals.length; i++) {
            let respostaAux = [];
            for (var j = 0; j < 8; j++) {
                if (respostaParts.normals[i][j] === 0) {
                    respostaAux.push("F");
                } else if (respostaParts.normals[i][j] === 1) {
                    respostaAux.push("M");
                } else if (respostaParts.normals[i][j] === 2) {
                    respostaAux.push("T");
                } else if (respostaParts.normals[i][j] === 3) {
                    respostaAux.push("N");
                }
            }
            respostaTransformadaNormais.push(respostaAux);
        }

        for (var i = 0; i < respostaParts.onlyMornings.length; i++) {
            let respostaAux = [];
            for (var j = 0; j < 8; j++) {
                if (respostaParts.onlyMornings[i][j] === 0) {
                    respostaAux.push("F");
                } else if (respostaParts.onlyMornings[i][j] === 1) {
                    respostaAux.push("M");
                } else if (respostaParts.onlyMornings[i][j] === 2) {
                    respostaAux.push("T");
                } else if (respostaParts.onlyMornings[i][j] === 3) {
                    respostaAux.push("N");
                }
            }
            respostaTransformadaManhas.push(respostaAux);
        }

        for (var i = 0; i < respostaParts.onlyMorningsNoWeekends.length; i++) {
            let respostaAux = [];
            for (var j = 0; j < 8; j++) {
                if (respostaParts.onlyMorningsNoWeekends[i][j] === 0) {
                    respostaAux.push("F");
                } else if (respostaParts.onlyMorningsNoWeekends[i][j] === 1) {
                    respostaAux.push("M");
                } else if (respostaParts.onlyMorningsNoWeekends[i][j] === 2) {
                    respostaAux.push("T");
                } else if (respostaParts.onlyMorningsNoWeekends[i][j] === 3) {
                    respostaAux.push("N")
                }
            }
            respostaTransformadaManhasSemFds.push(respostaAux);
        }
        console.log(respostaTransformadaChefes)
        console.log(respostaTransformadaNormais)
        console.log(respostaTransformadaManhas)
        console.log(respostaTransformadaManhasSemFds)
        /*------------------------*/
        /*Construção do calendário*/
        for (var j = 0; j < this.state.chiefs; j++) {
            let linha = [];
            linha.push(<li>Chefe_Equipa_{j}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][0]}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][1]}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][2]}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][3]}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][4]}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][5]}</li>);
            linha.push(<li>{respostaTransformadaChefes[j][6]}</li>);
            table.push(<ul className="days">{linha}</ul>)
        }
        for (var i = 0; i < this.state.normals; i++) {
            let linha = [];
            linha.push(<li>Normal_{i}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][0]}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][1]}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][2]}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][3]}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][4]}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][5]}</li>);
            linha.push(<li>{respostaTransformadaNormais[i][6]}</li>);
            table.push(<ul className="days">{linha}</ul>)
        }
        for (var l = 0; l < this.state.onlyMornings; l++) {
            let linha = [];
            linha.push(<li>Licenca_{l}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][0]}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][1]}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][2]}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][3]}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][4]}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][5]}</li>);
            linha.push(<li>{respostaTransformadaManhas[l][6]}</li>);
            table.push(<ul className="days">{linha}</ul>)
        }
        for (var g = 0; g < this.state.onlyMorningsNoWeekends; g++) {
            let linha = [];
            linha.push(<li>Chefe_ou_2o_{g}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][0]}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][1]}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][2]}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][3]}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][4]}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][5]}</li>);
            linha.push(<li>{respostaTransformadaManhasSemFds[g][6]}</li>);
            table.push(<ul className="days">{linha}</ul>)
        }
        return table;
    }
    render() {
        return (
            // ads with no set-up
            <form onSubmit="return false">
           <ins className='adsbygoogle' style={{ display: 'block' }} data-ad-client='ca-pub-12121212' data-ad-slot='12121212' data-ad-format='auto' />
           <input type="number" name="normals" placeholder="Número de enfermeiros normais"  onChange={this.normalsChange} />
           <input type="number" name="chiefs" placeholder="Número de enfermeiros chefes equipa" onChange={this.chiefsChange}/>
           <input type="number" name="onlyMornings" placeholder="Número de enfermeiros de licença (Só fazem manhãs)" onChange={this.onlyMorningsChange}/>
           <input type="number" name="onlyMorningsNoWeekends" placeholder="Número de enfermeiros chefe ou segundo elemento (Só dias de semana e manhã)" onChange={this.onlyMorningsNoWeekendsChange}/>
           <button type="button" onClick={this.storeValues}>Guardar Enfermeiros</button>
           <div className="month"> 
              <ul>
                <li>Calendário Semanal</li>
              </ul> 
           </div>
          <ul className="weekdays">
              <li>Enfermeiro</li>
              <li>Segunda</li>
              <li>Terça</li>
              <li>Quarta</li>
              <li>Quinta</li>
              <li>Sexta</li>
              <li>Sábado</li>
              <li>Domingo</li>
            </ul>
              {this.createCalendar()}
      </form>);
    }
}

export default NameForm
