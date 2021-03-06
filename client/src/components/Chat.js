import React ,{Component} from 'react';
import Grid from '@material-ui/core/Grid';
import {TextField,Card,Paper,Typography, GridList, GridListTile, ListItem,List, Icon, IconButton} from '@material-ui/core';
import * as ReactDOM from 'react-dom';
import io from 'socket.io-client';
import swearjar from 'swearjar';
export default class Chat extends Component {
    
    constructor(props){
        super(props)
        this.state={
            key:0,
            textfield:'',
            textfieldUsername:'',
            username:'',
            messages:[
                
            ],
        }
        this.socket = io('localhost:3001');

        this.socket.on('RECEIVE_MESSAGE', function(data){
            recieveMessage(data);
        });
        const recieveMessage=(data)=>{
            let newMessage={
                username:data.username,
                id:this.state.key+1,
                content:swearjar.censor(data.content),
            }
            let newList = [...this.state.messages]
            newList.unshift(newMessage)
            
            this.setState({
                messages:newList,
                key:this.state.key+1
            })
            const chatlist = this.refs.chat;
            const scrollHeight = chatlist.scrollHeight;
            const clientHeight = chatlist.clientHeight;
            const maxScrollTop = scrollHeight - clientHeight;
            ReactDOM.findDOMNode(chatlist).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
            
        }
        
    }
    renderMessages=(user,message,key)=>{
        return(
        <Paper  style={styles.messagePaper} key={key}>
            <Typography variant='subtitle1' color='secondary' styles={styles.messageTitle}>{user}</Typography>
            <Typography   noWrap type="body1" style={styles.messageText}>{message}</Typography>
        </Paper>    
        )
    }
    handleChangeInput=(input)=>{
        this.setState({
            textfield:input
        })
    }
    handleChangeUsername=(input)=>{
        this.setState({
            textfieldUsername:input.toUpperCase(),
        })
        
    }
    handleUsername=()=>{
        this.setState({
            username:this.state.textfieldUsername,
        })

    }
    handleSend=e=>{
        if(this.state.textfield !=''&&this.state.username!==''){
            this.socket.emit('SEND_MESSAGE', {
                username: this.state.username,
                content: this.state.textfield
            })
       }else {
           window.alert('message canot be empty or username')
       }
       this.setState({textfield:''})
    }
    onKeyPres=(event)=>{
        if (event.charCode === 13) { // enter key pressed
            event.preventDefault();
            window.alert('enter')
          }
        console.log('llego') 
    }
    render() {
        return (
                <Grid  style={styles.chatScreen} alignItems='center' container direction="row" spacing={8}>    
                    <Grid item wrap='nowrap'  container direction='column' lg={7}
                    style={styles.chatContainer}>
                        <Grid ref='chat' style={styles.chat}>
                            {
                                this.state.messages.map((message)=>{
                                    return(
                                        <Paper  style={styles.messagePaper} key={message.id}>
                                            <Typography variant='subtitle1' color='secondary' styles={styles.messageTitle}>{message.username}</Typography>
                                            <Typography   noWrap type="body1" style={styles.messageText}>{message.content}</Typography>
                                        </Paper> 
                                    )
                                })
                            }
                        </Grid>
                        <Grid container direction='row' style={styles.messageInputContainer}>
                            <TextField  value={this.state.textfield} 
                            onChange={e => this.handleChangeInput(e.target.value)} 
                            ref='texfield' style={styles.messageInput}/>
                            <IconButton color='primary'
                            style={{width: '55px', height: '55px',marginLeft:10}}
                            onClick={this.handleSend} onKeyDown={this.onKeyPres}>
                            <Icon>send</Icon>
                            </IconButton>
                        </Grid>           
                    </Grid>
                    <Grid container direction='column' lg={5} style={styles.optionsContainer}>
                        <Typography variant='title' style={styles.optionsTitle}>Enter your username</Typography>               
                        <Typography style={styles.optionsUsername} variant='subtitle1' username>Username: {this.state.username}</Typography>
                        <Grid container direction='row' style={this.state.username?{display:'none'}:{}}>
                            <TextField  value={this.state.textfieldUsername} 
                            onChange={e => this.handleChangeUsername(e.target.value)} 
                            ref='texfieldUsername' style={styles.usernameInput}/>
                            <IconButton color='primary'
                            style={{width: '50px', height:'50px',marginLeft:10}}
                            onClick={()=>this.handleUsername()}>
                            <Icon>send</Icon>
                            </IconButton>
                        </Grid>
                    </Grid> 
                </Grid>
        )
    }
}

const styles = ({
    chat:{
        marginTop:40,
        marginLeft:40,
        borderRadius:3,
        padding:10,
        /* backgroundImage: `url(${chatBackground})`, */
        height:500,
        overflow: 'scroll',
        overflowX: 'hidden',
        backgroundColor:'#00838F',
        
    },
    chatScreen:{ 
        backgroundColor:'#FAFAFA',
        height:700,
        width:'100%',
        marginTop:10
    },
    chatContainer:{
        height:650,
    },
    messagePaper:{
        
        maxWidth:'100%',
        marginTop:10,
        padding:10,
        borderRadius:3,
        backgroundColor:'#FAFAFA',
        
    },
    messageTitle:{
        color:'#dd33fa'
    },
    messageText:{
        overflow: 'hidden',
        lineHeight: 'inherit'
        
    },
    messageInputContainer:{
        marginLeft:40,
        marginTop:30,
        height:100,
    },
    messageInput:{
        width:'90%',
        height:30,
        borderBottomColor:'#dd33fa'
    },
    iconSend:{
        marginLeft:20
    },
    optionsContainer:{
        marginTop:10,
        height:700,
        backgroundColor:'#FAFAFA',
        justifyContent:'flex-start'
    },
    optionsTitle:{
        color:'#757575',
        marginTop:65,
        marginLeft:40,
    },
    optionsUsername:{
        color:'#757575',
        marginLeft:40,
        marginTop:40,
       
    },
    usernameInput:{
        marginLeft:40,
        width:'70%',
        height:30,
    }

})