import React from 'react'

function DateFormat() {

    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

     const suffix =
    day > 3 && day < 21
      ? "th"
      : ["st", "nd", "rd"][day % 10 - 1] || "th";

  return (
    <div className='flex flex-col items-end text-white/50'>
      <p>{day}{suffix} {month}</p>
      <p>{year}</p>
    </div>
  )
}

function Message(){
  const date = new Date();
  const hours = date.getHours();

  let message = "";

  if (hours < 12) {
    message = "Good Morning..!";
  } else if (hours < 18) {
    message = "Good Afternoon..!";
  } else {
    message = "Good Evening";
  }
  return (
    message
  );
}


export {DateFormat,Message}