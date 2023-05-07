import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'



const API_KEY=import.meta.env.VITE_API_KEY


const ChatBot=  ()=> {

  const [typing,setTyping]=useState(false)

  const [messages, setMessages] = useState([
    {
      message:"Hola !  This is Anny farmSense's official support. How can I help you? ",
      sender:"ChatGPT"
    }
  ])
   
  const handleSend= async (message)=>{
    const newMessage={
      message:message,
      sender:"user",
      direction:"outgoing"
    }
    const newMessages=[...messages,newMessage]

    setMessages(newMessages)

    setTyping(true)

    await processMaessageToChatGPT(newMessages)
  }

  async function processMaessageToChatGPT(chatMessages){

    let apiMessages=chatMessages.map((messageObject)=>{
      let role=""
      if(messageObject.sender==="ChatGPT"){
        role="assistant"
      }else{
        role="user"
      }
      return {role:role,content:messageObject.message}
    })

    const systemMessage={
      role:"system",
      content:"speak like a doctor"
    }

    const apiRequestBody={
      "model":"gpt-3.5-turbo",
      "messages" : [
        systemMessage,
        ...apiMessages
      ]
    }

    console.log(API_KEY)

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":"Bearer " + API_KEY,
        "Content-Type":"application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=>{
      return data.json()
    }).then((data)=>{
      console.log(data);
      console.log(data.choices[0].message.content)
      setMessages(
        [...chatMessages,{
          message:data.choices[0].message.content,
          sender:"ChatGPT"
        }]
      )
      setTyping(false)
    })
  }
  

  return (
    <div className="App">
      <div className="chatbot flex h-[350px] flex-col justify-between  lg:w-[500px]  lg:h-[600px] border-solid border-[2px] lg:m-3 m-5  " >
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing?<TypingIndicator content="Wait"/>:null}
            >
              {messages.map((message,i)=>{
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='What happened to your Chick!' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default ChatBot