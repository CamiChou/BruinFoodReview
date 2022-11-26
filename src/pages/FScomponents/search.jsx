import { render } from '@testing-library/react'
import React from 'react'
import {Button} from 'react-bootstrap'
import Restaurant from './restaurant'

export default class Search extends React.Component{
    constructor(){
        super()
        this.state={
            dining:[]
        }
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                this.setState({
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                })
            })
        } else{
            this.setState({
                lng:null,
                lat:null
            
            })
        }

        this.search=this.search.bind(this)
        this.handleChange=this.handleChange.bind(this)

    }

    handleChange(e){
        this.setState({
            val:e.target.value
        })
    }


search(event){
    const{lng, lat,val}=this.state

    fetch('http://localhost:3000/dining/search?value=${val}&lat=${lat}&lng=${lng}')
    .then(data=>data.json())
    .then(data=>this.handleSearchResults(data))
}

handleSearchResults(data){
    this.setState({
        dining:data.dining
    })
}

render(){
    const{dining}=this.state

    return(
        <>
            <h2>Enter a type of cuisine: <input type="text" onChange=
            {this.handleChange}/> <Button id="search" onClick={this.search}> Search!</Button>            
            </h2>
            <div className="card-columns">
                {
                    dining.length>0?(
                        dining.map((restaurant,i)=>(
                            <Restaurant restaurant={restaurant} key={i}/>                            
                        ))
                    ) : <p>No Results</p>
                }
            </div>
        </>
    )
}

}