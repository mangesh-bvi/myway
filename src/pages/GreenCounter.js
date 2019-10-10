import React, { Component } from "react";
 
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Bar,Line,Doughnut} from "react-chartjs-2";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";

 

 
var carboneOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "white",
          fontSize: 14
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "white",
          fontSize: 14
        }
      }
    ]
  }
};

var volumeOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "black",
          fontSize: 14
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "black",
          fontSize: 14
        }
      }
    ]
  }
};

var greencounterOption = {
  legend: {
    display: false
  },
  rotation: 0.75 * Math.PI,
  circumference: 1.5 * Math.PI,
  cutoutPercentage: 80,
  padding:40
  
};
 
class GreenCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      selectData: [
        { key: "Year", value: "Year" },
        { key: "Month", value: "Month" }
      ]
    };
  }

  componentWillMount() {
    this.HandleVolumeChartData();
  }
  
HandleChangeSelect(event){
  debugger;
}
  HandleVolumeChartData() {
    debugger;
    let self = this;
    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = window.localStorage.getItem("userid");
    axios({
      method: "post",
      url: "http://vizio.atafreight.com/MyWayAPI/GreenCounterEmission",
      data: {
        UserID: userid,
        ViewType: "Month",
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      debugger;    
      self.setState({ chartData: response.data.Table });
    });
  }

  render() {
    const label = [];
    const volumnedata = [];
    const carbonelable=[];   
    const greenCounterdata = {
      labels: ["Green", "Red"],
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ["#63CD16", "#EF1617"],
          hoverBackgroundColor: ["#63CD16", "#EF1617"],
          borderWidth: 0
        }
      ],
      text: "23%"
    };
    
    for (let i = 0; i < this.state.chartData.length; i++) {
        label.push(this.state.chartData[i]["CO2YEAR"]);
      volumnedata.push(this.state.chartData[i]["Tons_Weight"]);
      carbonelable.push(this.state.chartData[i]["CarbonEmission"])
    }
    const volumeChartData = {
      labels: label,
      datasets: [
        {
          backgroundColor: "rgba(11,182,226,1)",
          borderColor: "rgba(11,182,226,1)",
          borderWidth: 2,
          data: volumnedata
        }
      ]
    };


    const carboneCharData = {
      labels: label,
      datasets: [
        {
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(255,255,255,1)",
          borderCapStyle: "round",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: carbonelable
        }
      ]
    };

    return (
      <>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>

          <div className="row grncuntr">
            <div className="col-md-6">
              <div className="card carbonechart">
                <div>
                  <label className="grncuntr-lbl">Volunm Analysis</label>
                  <select className="brncuntr-select" onChange={this.HandleChangeSelect.bind(this)}>
                    {/* <option>Year</option>
                    <option>Month</option>
                    <option>Day</option> */}
                    {this.state.selectData.map((team) => <option key={team.key} value={team.value}>{team.value}</option>)}
                  </select>
                </div>
                {/* <Chart
                      chartType="ColumnChart"
                      width="100%"
                      height="100%"
                      data={volumedata}
                      options={options}
                    /> */}
                <Bar
                  data={volumeChartData}
                  width={100}
                  height={50}
                  options={volumeOptions}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="card carbonemn-card">
                <div>
                  <label className="grncuntr-lbl1">Carbon Emission</label>
                  <select className="brncuntr-select1">
                    <option>Year</option>
                    <option>Month</option>
                    <option>Day</option>
                  </select>
                </div>
                <div>
                  {/* <Chart
                    chartType="Line"
                    data={Carbonedata}
                    options={carboneoptions}
                  /> */}
                  <Line
                    data={carboneCharData}
                    width={100}
                    height={50}
                    options={carboneOptions}
                  />
                </div>
              </div>
              <div className="card">
                <div>
                  <label className="grncuntr-lbl">Green Conuter</label>
                </div>
                {/* <div className="dot">
                  <div className="dot1"></div>
                </div> */}
                <Doughnut
                  data={greenCounterdata}
                  width={100}
                  height={50}
                  options={greencounterOption}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default GreenCounter;
