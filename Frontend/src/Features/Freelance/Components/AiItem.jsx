import React from 'react'
import AiSidebar from './AiSidebar'
import Email from './Email'
import Proposal from './Proposal'
import Contract from './Contract'
import Invoice from './Invoice'

export default function AiItem(props) {

  let element;

  if(props.pageState === "email"){
    element = <Email/>
  }else if(props.pageState === "proposal"){
    element = <Proposal/>
  }else if(props.pageState === "contract"){
    element = <Contract/>
  }else{
    element = <Invoice/>
  }
  return (
    <>
      <div className='flex min-h-[calc(100vh-72px)] w-full px-3 pb-24 md:px-5'>
          <div className='flex w-20 shrink-0 justify-center items-center py-8'>
            <AiSidebar/>
          </div>
          <div className='min-w-0 flex-1 px-10'>
            {element}
          </div>
      </div>
    </>
  )
}
