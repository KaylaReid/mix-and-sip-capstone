import React, { Component } from "react"; 
import { Button, Input, Message, Icon, Divider, Popup } from 'semantic-ui-react';
import DataManager from "../../modules/DataManager";

export default class EditIngCard extends Component {
    state = {
        edit: false,
        name: "",
        alreadyHave: false,
        isBank: false
    }

    handleFieldChange = evt => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }
     
    componentDidMount(){
        this.setState({
            name: this.props.ingredient.name
        })
    }

    changeToEdit = () => {
        this.setState({edit: true})
    }

    saveChange = () => {
       if(this.props.ingredients.find(ing => ing.name === this.state.name.toLowerCase())){
           this.setState({alreadyHave: true})
       } else if(this.state.name === "") {
            this.setState({isBank: true})
       } else {
           const update = {
               name: this.state.name
           }
           DataManager.patch("ingredients", update, this.props.ingredient.id)
           .then(() => {this.props.resetData()})
           .then(() => this.setState({
               edit: false,
               isBank: false,
               alreadyHave:false
            }))
       }
    }

    addToGet = () => {
        let toGetItem = {
            userId: this.props.user.id,
            ingredientId: this.props.ingredient.id
        }
        DataManager.add("toGetIngredients", toGetItem)
        .then(() => {this.props.resetData()})
    }

    addToOnHand = () => {
        DataManager.patch("ingredients", {onHand: true}, this.props.ingredient.id)
        .then(() => {this.props.resetData()})
    }

    cancel = () => {
        this.setState({
            edit: false,
            name: this.props.ingredient.name,
            isBank: false,
            alreadyHave:false
        })
    }

    render(){
        
        return (
            <div id={this.props.ingredient.id}>
                {
                    !this.state.edit &&
                    <div className="manage-ing-edit-btn">
                        <p className="capitalize">{this.state.name}</p> 
                        <div>
                            {
                                this.props.toGets.find(toGet => toGet.ingredientId === this.props.ingredient.id) &&
                                <Button animated disabled onClick={this.addToGet}>
                                    <Button.Content visible><Icon name="add to cart" /></Button.Content>
                                    <Button.Content hidden>Cart</Button.Content>
                                </Button>
                            }
                            {
                                !this.props.toGets.find(toGet => toGet.ingredientId === this.props.ingredient.id) &&
                                <Button animated className="font" onClick={this.addToGet}>
                                    <Button.Content visible><Icon name="add to cart" /></Button.Content>
                                    <Button.Content hidden>Cart</Button.Content>
                                </Button>

                            }
                            {
                                this.props.ingredient.onHand &&
                                <Button animated disabled onClick={this.addToOnHand}>
                                    <Button.Content visible><Icon name="add" /></Button.Content>
                                    <Button.Content hidden>In stock</Button.Content>
                                </Button>
                            }
                            {
                                !this.props.ingredient.onHand &&
                                <Button animated className="font" onClick={this.addToOnHand}>
                                    <Button.Content visible><Icon name="add" /></Button.Content>
                                    <Button.Content hidden>In stock</Button.Content>
                                </Button>
                            }
                            <Button animated  className="font" onClick={this.changeToEdit}>
                                <Button.Content visible><Icon name="edit" /></Button.Content>
                                <Button.Content hidden>Edit</Button.Content>
                            </Button>
                        </div>
                    </div>
                }
                
                {
                    this.state.alreadyHave &&
                    <Message info className="font">
                        This ingredient already exists please pick a difrent name.
                    </Message>
                }
                {
                    this.state.isBank &&
                    <Message info className="font">
                        Please fill out input!
                    </Message>
                }
                {
                    this.state.edit && 
                    <div className="edit-ing-card">
                        <div className="edit-ing-left">
                            <Popup
                                className="font"
                                trigger={<Input fluid label={{content:"Name"}} labelPosition="left" id="name" type="text" defaultValue={this.state.name} onChange=        {this.handleFieldChange}/>}
                                content='Please note making changes to a ingredient here will update it everywhere the ingredient is used! This feature is recomended for spelling corrections only.'
                                style={{borderRadius: "5px",
                                opacity: 0.85,
                                padding: '2em',
                                color: "#FFEEF2"
                                }}
                                inverted
                                position="bottom right"
                            />
                        </div>
                        <div className="edit-ing-right">
                            <Button.Group>
                                <Button animated onClick={this.saveChange}>
                                    <Button.Content visible><Icon name="checkmark" /></Button.Content>
                                    <Button.Content hidden className="font">Update</Button.Content>
                                </Button>
                                <Button animated onClick={this.cancel}>
                                    <Button.Content visible><Icon name="cancel" /></Button.Content>
                                    <Button.Content hidden className="font">Cancel</Button.Content>
                                </Button>
                            </Button.Group>
                        </div>
                    </div>
                }
                <Divider />
            </div>)
    }
}