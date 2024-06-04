import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
const MyStatistics=props=>{
    const data={
        labels:props.labels,
        datasets:[{
            label:props.label,
            data:props.data,
            fill:false,
            backgroundColor:props.backgroundColor||'rgb(75, 192, 192)',
            borderColor:props.borderColor||'rgba(75, 192, 192, 0.2)'
        }]
    }
    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
      return(
        <div>
            <h4>{props.text}</h4>
            <Line data={data} options={options}/>
        </div>
      )
}

export{MyStatistics};