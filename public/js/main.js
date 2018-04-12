document.addEventListener('DOMContentLoaded', (e) => {

  var parasTimes = document.querySelectorAll('.app--message--timestamp'); 
  const timeStamps = [];
  let timeHours = [];
  let timeDate = [];

  for (let i = 0; i < parasTimes.length; i++) {
    timeStamps.push(parseInt(parasTimes[i].innerText));
  }

  function moment(arr) {
    for (let i = 0; i < arr.length; i++) {
      const diff = new Date().getTime() - arr[i];
      const sentMoment = Math.floor(diff / 1000 / 60 / 60);
      if (sentMoment > 24) {
        let dateOfPost = new Date(arr[i]);
        dateOfPost = "" + dateOfPost;
        timeDate.push(dateOfPost.slice(4, 10));
        parasTimes[i].innerText = timeDate[i];
      } else {
        timeHours.push(sentMoment + 'h');
        parasTimes[i].innerText = timeHours[i];
      }
    }
  }
  
  moment(timeStamps);

});
