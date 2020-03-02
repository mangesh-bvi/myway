import React, { Component } from "react";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import Logo from "./../assets/img/logo.png";
import "react-rangeslider/lib/index.css";
import { encryption } from "../helpers/encryption";
import CountUp from "react-countup";
import Image from "./../assets/img/Tree.png";
import Image1 from "./../assets/img/Tree-CO2.png";

var carboneOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawOnChartArea: false
        },
        ticks: {
          fontColor: "white",
          fontSize: 14
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false
        },
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
        gridLines: {
          drawOnChartArea: false
        },
        ticks: {
          fontColor: "black",
          fontSize: 14
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false
        },
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
  tooltips: {
    enabled: false
  },
  rotation: 0.75 * Math.PI,
  circumference: 1.5 * Math.PI,
  cutoutPercentage: 80,
  padding: 40
};

class GreenCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volumechartData: [],
      carbonechartData: [],
      greencounterData: [],
      totalTreePlanted: "",
      volume: 0,
      selectData: [
        { key: "Year", value: "Year" },
        { key: "Month", value: "Month" }
      ],
      volumeselectType: "Year",
      carboneselectType: "Year",
      treecount: "",
      cotowemission: "",
      totalTreeCO2: ""
    };
  }

  componentWillMount() {
    this.BindVolumeChartData();
    this.BindCarboneChartData();
    this.BindGreenCounterChartData();
    this.BindTreePlantaionData();
  }
  handleOnChange = value => {
    this.setState({
      volume: value
    });
  };

  HandleVolumeChangeSelect(event) {
    this.BindVolumeChartData(event.target.value);
  }
  HandleCarboneChangeSelect(event) {
    this.BindCarboneChartData(event.target.value);
  }
  ////Handle Volume Chart Data
  BindVolumeChartData(selectval) {
    let self = this;
    var selectvalnew = this.state.volumeselectType;

    if (typeof selectval != "undefined") {
      selectvalnew = selectval;
    }
    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GreenCounterEmission`,
      data: {
        UserID: userid,
        ViewType: selectvalnew,
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      self.setState({ volumechartData: response.data.Table });
    });
  }
  /////Bind Carbone Chart Data
  BindCarboneChartData(selectval) {
    let self = this;
    var selectcartype = this.state.carboneselectType;
    if (typeof selectval != "undefined") {
      selectcartype = selectval;
    }

    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GreenCounterEmission`,
      data: {
        UserID: userid,
        ViewType: selectcartype,
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      self.setState({
        carbonechartData: response.data.Table
      });
    });
  }
  ////Bind Tree Plantaion Data
  BindTreePlantaionData() {
    let self = this;
    var d = new Date();
    var year = d.getFullYear();
    axios({
      method: "post",
      url: `${appSettings.APIURL}/TreePlantationData`,
      data: {
        YEAR: year,
        UserID: encryption(window.localStorage.getItem("userid"), "desc")
      },
      headers: authHeader()
    }).then(response => {
      self.setState({
        totalTreePlanted: response.data[0].TreePlanted,
        totalTreeCO2: response.data[0].CO2Emmision
      });
    });
  }

  ///Bind Green Couneter Emission Chart Data
  BindGreenCounterChartData() {
    let self = this;
    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = encryption(window.localStorage.getItem("userid"), "desc");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GreenCounterEmission`,
      data: {
        UserID: userid,
        ViewType: "Web",
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      debugger;
      self.setState({ greencounterData: response.data.Table });
      var greendata = response.data.Table;
      self.setState({
        treecount: greendata[0]["NoOfTreesPlanted"],
        cotowemission: greendata[0]["CarbonEmission"].toFixed(2)
      });
    });
  }
  render() {
    let { totalTreePlanted, totalTreeCO2 } = this.state;
    let vollabel = [];
    let carlabel = [];
    let volumnedata = [];
    let carbonelabledata = [];
    let greenCounterdata = {
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

    for (let i = 0; i < this.state.volumechartData.length; i++) {
      vollabel.push(this.state.volumechartData[i]["CO2YEAR"]);
      volumnedata.push(this.state.volumechartData[i]["Tons_Weight"]);
    }

    for (let i = 0; i < this.state.carbonechartData.length; i++) {
      carlabel.push(this.state.carbonechartData[i]["CO2YEAR"]);
      carbonelabledata.push(this.state.carbonechartData[i]["CarbonEmission"]);
    }
    const volumeChartData = {
      labels: vollabel,
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
      labels: carlabel,
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
          data: carbonelabledata
        }
      ]
    };
    var lbl = { 1: "1M", 2: "2M", 3: "3M" };
    var colClassName = "";
    if (localStorage.getItem("isColepse") === "true") {
      colClassName = "cls-flside colap";
    } else {
      colClassName = "cls-flside";
    }
    return (
      <>
        <Headers />
        <div className="cls-ofl">
          <div className={colClassName}>
            <SideMenu />
          </div>

          <div className="cls-rt" style={{ backgroundColor: "transparent" }}>
            <div className="row grncuntr">
              <div className="col-md-6">
                <div className="card carbonechart">
                  <div>
                    <div className="volcls">
                      <label className="grncuntr-lbl">Volume Analysis</label>
                      <select
                        className="brncuntr-select"
                        onChange={this.HandleVolumeChangeSelect.bind(this)}
                      >
                        {this.state.selectData.map(team => (
                          <option key={team.key} value={team.value}>
                            {team.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Bar
                      data={volumeChartData}
                      width={100}
                      height={35}
                      options={volumeOptions}
                    />
                  </div>
                </div>
                <div className="card carbonechart">
                  <div>
                    <div className="volcls">
                      <label className="grncuntr-lbl">
                        Trees Planted by ATAFreight
                      </label>
                      <img src={Image} alt="vizio-icon" className="tree-img" />
                      <div className="tree-dv">
                        <CountUp start={1} end={totalTreePlanted}></CountUp>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card carbonechart">
                  <div>
                    <div className="volcls">
                      <label className="grncuntr-lbl">
                        Total CO<sub>2</sub> Offset from Trees Planted
                      </label>
                      <img src={Image1} alt="vizio-icon" className="tree-img" />
                      <div className="tree-dv">
                        <CountUp
                          start={1}
                          end={totalTreeCO2}
                          decimals={2}
                        ></CountUp>
                        <span> (MT)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card carbonemn-card">
                  <div>
                    <label className="grncuntr-lbl1">Carbon Emission</label>
                    <select
                      className="brncuntr-select1"
                      onChange={this.HandleCarboneChangeSelect.bind(this)}
                    >
                      {this.state.selectData.map(team => (
                        <option key={team.key} value={team.value}>
                          {team.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Line
                      data={carboneCharData}
                      width={100}
                      height={35}
                      options={carboneOptions}
                    />
                  </div>
                </div>
                <div className="card">
                  <div>
                    <label className="grncuntr-lbl">Green Counter</label>
                  </div>
                  <div className="row" style={{ "margin-left": "107px" }}>
                    <div className="col-md-7">
                      <div className="dot">
                        <Doughnut
                          data={greenCounterdata}
                          width={700}
                          height={600}
                          options={greencounterOption}
                        />
                        <img
                          src={Logo}
                          alt="vizio-icon"
                          className="greenchart-img"
                        />
                        <label className="greenchartlbl">
                          Tons of
                          <br /> CO<sub>2</sub> Emissions
                        </label>
                        <label className="counterval">
                          {this.state.cotowemission}
                        </label>
                      </div>
                    </div>
                  </div>
                  <label className="greenchartlbl1">
                    {this.state.treecount} trees Planted
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default GreenCounter;
