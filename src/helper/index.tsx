const convertTimestamp = (timestamp: any) => {
      // Ensure the timestamp is a valid Date object
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date'; // Handle invalid Date
      }
    
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero for single digit minutes
    
      // 12-hour format conversion
      if (hours > 12) {
        return `${hours - 12}:${formattedMinutes} PM`;
      } else {
        return `${hours}:${formattedMinutes} AM`;
      }
    };
    

    export default convertTimestamp;

