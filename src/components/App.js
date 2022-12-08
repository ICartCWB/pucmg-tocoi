import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Marketplace from '../abis/TocoiMarket.json'
import Token from '../abis/Tocoi.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    const marketplaceAddr = networkData.address
    if (networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi, marketplaceAddr)
      const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
      this.setState({ marketplace, token, marketplaceAddr })
      const totalTocoi = await token.methods.totalSupply().call()
      this.setState({ totalTocoi })
      const area = await marketplace.methods.area().call()
      this.setState({ area })
      const valorImovel = await marketplace.methods.precoTotal().call()
      this.setState({ valorImovel })
      const precoTocoi = valorImovel / (totalTocoi/100)
      this.setState({ precoTocoi })
      const taxaInversa = await marketplace.methods.taxaInversa().call()
      const taxa = (1/taxaInversa)*100
      this.setState({ taxa })
      const comprasCount = await marketplace.methods.comprasCount().call()
      // console.log(comprasCount.toString())
      this.setState({ comprasCount })
      //Load cotasCompradas
      for (let i = 0; i < comprasCount; i++) {
        const cotaComp = await marketplace.methods.cotasCompradas(i).call()
        this.setState({
          cotasCompradas: [...this.state.cotasCompradas, cotaComp]
        })
      }
      this.setState({ loading: false })
      console.log(this.state.cotasCompradas)
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      totalTocoi: 0,
      area: 0,
      valorImovel: 0,
      precoTocoi: 0,
      taxa: 0,
      comprasCount: 0,
      cotasCompradas: [],
      loading: true
    }

    this.devolveCota= this.devolveCota.bind(this)
  }

  alteraPreco = (price) => {
    this.setState({ loading: true })
    this.state.marketplace.methods.alteraPreco(price).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        this.setState({ loading: false })
        window.location.reload()
      })
  }

  compraCota = (qtde) => {
    this.setState({ loading: true })
    //const price = qtde * this.state.precoTocoi
    const price = window.web3.utils.toWei((qtde * this.state.precoTocoi/100).toString(), 'ether')
    this.state.marketplace.methods.compraCota(qtde).send({ from: this.state.account, value: price })
      .on('receipt', (receipt) => {
        this.setState({ loading: false })
        window.location.reload()
      })
  }
  
  devolveCota(id, qtde) { // checar qtde no main.js
    this.setState({ loading: true })
    const taxaAPagar = (this.state.taxa/100) * qtde * this.state.precoTocoi

    console.log("Aprovando transferência de Token...")  
    this.state.token.methods.approve(this.state.marketplaceAddr, qtde).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log("Aprovado. Devolvendo cotas...")

        this.state.marketplace.methods.devolveCota(id).send({ from: this.state.account, value: taxaAPagar })
                .on('receipt', (receipt) => {
                        console.log("Devolvida")
                        this.setState({ loading: false })
                        window.location.reload()
        })

      })
    
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Carregando...</p></div>
                : <Main
                  totalTocoi = {this.state.totalTocoi}
                  area = {this.state.area}
                  valorImovel = {this.state.valorImovel}
                  precoTocoi = {this.state.precoTocoi}
                  taxa = {this.state.taxa}
                  comprasCount = {this.state.comprasCount}
                  cotasCompradas = {this.state.cotasCompradas}
                  alteraPreco = {this.alteraPreco}
                  compraCota = {this.compraCota}
                  devolveCota = {this.devolveCota} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
