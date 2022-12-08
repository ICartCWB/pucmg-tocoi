import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h2>Detalhes</h2>
        <p>Área do terreno: {this.props.area} m²</p>
        <p>Total de tokens: {this.props.totalTocoi/100} Tocoi</p>
        <p>Valor do imóvel: {this.props.valorImovel} ETH</p>
        <p>Preço de 1 Tocoi: {this.props.precoTocoi} ETH</p>
        <p>Taxa de devolução: {this.props.taxa}% de ETH/Tocoi</p>
        <p>&nbsp;</p>
        <h2>Alterar valor do imóvel</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const price = this.valorImovel.value
          this.props.alteraPreco(price) // necessário valor inteiro da entrada
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="valorImovel"
              type="text"
              ref={(input) => { this.valorImovel = input }}
              className="form-control"
              placeholder="Novo valor do imóvel em ETH (não fracionado)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Alterar Preço</button>
        </form>
        <p>&nbsp;</p>
        <h1>Comprar Cotas</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          //const qtde = window.web3.utils.toWei(this.qtdeCotas.value.toString(), 'ether')
          const qtde = this.qtdeCotas.value * 100
          this.props.compraCota(qtde)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="qtdeCotas"
              type="text"
              ref={(input) => { this.qtdeCotas = input }}
              className="form-control"
              placeholder="Quantidade de cotas a serem compradas (em Tocoi)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Comprar Cotas</button>
        </form>
        <p>&nbsp;</p>
        <h2>Cotas compradas</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Preço pago</th>
              <th scope="col">Quantidade</th>
              <th scope="col">Proprietário</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="cotasCompradasList">
            {this.props.cotasCompradas.map((cotaComp, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{cotaComp.id.toString()}</th>
                  <td>{cotaComp.precoPago}</td>
                  <td>{cotaComp.qtde/100} Tocoi</td>
                  <td>{cotaComp.owner}</td>
                  <td>
                    {!cotaComp.devolvida
                      ? <button
                        name={cotaComp.id}
                        value={cotaComp.qtde}
                        onClick={(event) => {
                          this.props.devolveCota(event.target.name, event.target.value)
                        }}
                        >
                          Devolver cota
                        </button>
                      : null
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
  
}

export default Main;
