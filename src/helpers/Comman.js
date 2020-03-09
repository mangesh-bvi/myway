import React, { Component } from "react";
class Comman extends Component {
  constructor(props) {
    super(props);

    this.state = {
      packageTypeData: [],
      NonStackable: false,
      containerLoadType: "",
      multiCBM: [
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ],
      TruckTypeData: []
    };
  }
  componentDidMount() {
    if (
      this.props.containerLoadType == "LCL" ||
      this.props.containerLoadType == "AIR" ||
      this.props.containerLoadType == "LTL"
    ) {
      this.setState({
        NonStackable: this.props.NonStackable,
        multiCBM: this.props.multiCBM
      });
    }

    if (this.props.containerLoadType == "FTL") {
      this.setState({
        TruckTypeData: this.props.TruckTypeData
      });
    }
    if (this.props.containerLoadType == "FCL") {
      this.setState({ multiCBM: this.props.multiCBM });
    }
  }

  componentDidUpdate() {
    if (this.props.NonStackable !== this.state.NonStackable) {
      this.toggleNonStackable();
    } else {
    }
  }
  ////send back value in parent componenet data
  SendData = () => {
    if (
      this.props.containerLoadType === "LCL" ||
      this.props.containerLoadType === "AIR" ||
      this.props.containerLoadType === "LTL" ||
      this.props.containerLoadType === "FCL"
    ) {
      this.props.parentCallback(this.state.multiCBM);
    }
    if (this.props.containerLoadType === "FTL") {
      this.props.parentCallback(this.state.TruckTypeData);
    }
  };
  //// start dynamic element for LCL-AIR-LTL

  CreateMultiCBM() {
    return this.state.multiCBM.map((el, i) => (
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            <select
              className="select-text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              name="PackageType"
              value={el.PackageType}
            >
              .<option selected>Select</option>
              {this.props.packageTypeData.map((item, i) => (
                <option key={i} value={item.PackageName}>
                  {item.PackageName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="QTY"
              className="w-100"
              name="Quantity"
              value={el.Quantity || ""}
              //onKeyUp={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"L (cm)"}
              className="w-100"
              name="Lengths"
              value={el.Lengths || ""}
              // onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"W (cm)"}
              className="w-100"
              name="Width"
              value={el.Width || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          {(this.props.containerLoadType.toUpperCase() == "LCL" ||
            "AIR" ||
            "LTL") &&
          this.props.NonStackable ? (
            <div className="spe-equ">
              <input
                type="text"
                onChange={this.HandleChangeMultiCBM.bind(this, i)}
                placeholder="H (cm)"
                className="w-100"
                name="Height"
                value={el.Height || ""}
                disabled
                //onBlur={this.cbmChange}
              />
            </div>
          ) : (
            <div className="spe-equ">
              <input
                type="text"
                onChange={this.HandleChangeMultiCBM.bind(this, i)}
                placeholder="H (cm)"
                className="w-100"
                name="Height"
                value={el.Height || ""}
                //onBlur={this.cbmChange}
              />
            </div>
          )}
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "GW(Kg)" : "GW(Kg)"}
              name="GrossWt"
              value={el.GrossWt || ""}
              className="w-100"
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              disabled
              name={
                this.props.containerLoadType === "LCL"
                  ? "Volume"
                  : "VolumeWeight"
              }
              // onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={
                this.state.containerLoadType === "LCL"
                  ? "KG"
                  : this.state.containerLoadType === "AIR"
                  ? "CW"
                  : "CW"
              }
              value={
                this.props.containerLoadType === "LCL"
                  ? el.Volume
                  : el.VolumeWeight || ""
              }
              className="w-100 weight-icon"
            />
          </div>
        </div>

        {i === 0 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-plus mt-2"
                aria-hidden="true"
                onClick={this.addMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : null}
        {this.state.multiCBM.length > 1 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-minus mt-2"
                aria-hidden="true"
                onClick={this.removeMultiCBM.bind(this, i)}
              ></i>
            </div>
          </div>
        ) : null}
      </div>
    ));
  }

  addMultiCBM() {
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          GrossWt: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ]
    }));
    if (this.state.NonStackable) {
      setTimeout(() => {
        this.toggleNonStackable();
        this.SendData();
      }, 100);
    }
  }

  ////Handle Change Muti CMB
  HandleChangeMultiCBM(i, e) {
    const { name, value } = e.target;

    let multiCBM = [...this.state.multiCBM];

    if ("PackageType" === name) {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value
      };
    } else {
      if (
        name === "Lengths" ||
        name === "Width" ||
        name === "Height" ||
        name === "GrossWt"
      ) {
        var jiji = value;

        if (isNaN(jiji)) {
          return false;
        }
        var splitText = jiji.split(".");
        var index = jiji.indexOf(".");
        if (index != -1) {
          if (splitText) {
            if (splitText[1].length <= 2) {
              if (index != -1 && splitText.length === 2) {
                multiCBM[i] = {
                  ...multiCBM[i],
                  [name]: value === "" ? 0 : value
                };
              }
            } else {
              return false;
            }
          } else {
            multiCBM[i] = {
              ...multiCBM[i],
              [name]: value === "" ? 0 : value
            };
          }
        } else {
          multiCBM[i] = {
            ...multiCBM[i],
            [name]: value === "" ? 0 : value
          };
        }
      } else {
        multiCBM[i] = {
          ...multiCBM[i],
          [name]: value === "" ? 0 : parseFloat(value)
        };
      }
    }

    this.setState({ multiCBM });
    if (this.props.containerLoadType === "FCL") {
      multiCBM[i] = {
        ...multiCBM[i],
        ["VolumeWeight"]: 0
      };
    } else {
      if (this.props.containerLoadType !== "LCL") {
        var decVolumeWeight =
          (multiCBM[i].Quantity *
            (parseFloat(multiCBM[i].Lengths) *
              parseFloat(multiCBM[i].Width) *
              parseFloat(multiCBM[i].Height))) /
          6000;
        if (multiCBM[i].GrossWt > parseFloat(decVolumeWeight)) {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: multiCBM[i].GrossWt
          };
        } else {
          multiCBM[i] = {
            ...multiCBM[i],
            ["VolumeWeight"]: parseFloat(decVolumeWeight.toFixed(2))
          };
        }
      } else {
        var decVolume =
          multiCBM[i].Quantity *
          ((parseFloat(multiCBM[i].Lengths) / 100) *
            (parseFloat(multiCBM[i].Width) / 100) *
            (parseFloat(multiCBM[i].Height) / 100));
        multiCBM[i] = {
          ...multiCBM[i],
          ["Volume"]: parseFloat(decVolume.toFixed(2))
        };
      }
    }
    this.setState({ multiCBM });

    setTimeout(() => {
      this.SendData();
    }, 100);

    var pathName = window.location.pathname;
    if (pathName === "/new-rate-search") {
      document.getElementById("cbm").classList.add("cbm");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document.getElementById("containerLoad").classList.add("less-padd");

      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  }

  removeMultiCBM(i) {
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
    this.SendData();
  }
  ////toggle Non stackable check box
  toggleNonStackable() {
    if (this.props.heightData) {
      for (var i = 0; i < this.props.heightData.length; i++) {
        if (
          this.props.heightData[i].Mode.toUpperCase() ==
          this.props.containerLoadType.toUpperCase()
        ) {
          for (var j = 0; j < this.state.multiCBM.length; j++) {
            if (this.props.NonStackable) {
              this.state.multiCBM[j].Height = this.props.heightData[i].Height;
            } else {
              this.state.multiCBM[j].Height = 0;
            }
          }
        }
      }
      this.setState({
        NonStackable: !this.state.NonStackable,
        multiCBM: this.state.multiCBM
      });
      this.SendData();
    }
  }

  //// create dynamic truck type UI
  createUITruckType() {
    return this.state.TruckTypeData.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr">
          <div className="spe-equ" style={{ margin: "auto" }}>
            <select
              className="select-text mr-3"
              name="TruckName"
              value={el.TruckName || 0}
              onChange={this.UITruckTypeChange.bind(this, i)}
            >
              <option>Select</option>
              {this.props.TruckType.map((item, i) => (
                <option key={i} value={item.TruckID}>
                  {item.TruckName}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
            <input
              className="mr-3"
              type="text"
              name="Quantity"
              value={el.Quantity || 1}
              placeholder="Quantity"
              onChange={this.UITruckTypeChange.bind(this, i)}
            />
            {el.TruckName === "others" ? (
              <input
                type="text"
                name="TruckDesc"
                placeholder="Other"
                onChange={this.UITruckTypeChange.bind(this, i)}
              />
            ) : null}

            {i === 0 ? (
              <div className="spe-equ">
                <i
                  className="fa fa-plus mt-2"
                  aria-hidden="true"
                  onClick={this.addClickTruckType.bind(this)}
                ></i>
              </div>
            ) : null}
            {this.state.TruckTypeData.length > 1 ? (
              <div className="spe-equ mt-2">
                <i
                  className="fa fa-minus"
                  aria-hidden="true"
                  onClick={this.removeClickTruckType.bind(this, i)}
                ></i>
              </div>
            ) : null}
          </div>
        </div>
      );
    });
  }

  addClickTruckType() {
    this.setState(prevState => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: 1,
          TruckDesc: ""
        }
      ]
    }));
  }

  removeClickTruckType(i) {
    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData.splice(i, 1);
    this.setState({ TruckTypeData });
  }

  UITruckTypeChange(i, e) {
    const { name, value } = e.target;

    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData[i] = {
      ...TruckTypeData[i],
      [name]: name === "Quantity" ? parseInt(value) : value,
      ["TruckDesc"]:
        name === "TruckName"
          ? e.target.options[e.target.selectedIndex].text
          : TruckTypeData[i].TruckDesc
    };
    this.setState({ TruckTypeData });

    setTimeout(() => {
      this.SendData();
    }, 200);

    var pathName = window.location.pathname;
    if (pathName === "/new-rate-search") {
      document.getElementById("cbm").classList.add("cbm");
      document.getElementById("cntrLoadInner").classList.add("cntrLoadType");
      document.getElementById("containerLoad").classList.add("less-padd");

      document
        .getElementById("cntrLoadIconCntr")
        .classList.add("cntrLoadIconCntr");
      document.getElementById("cntrLoadName").classList.remove("d-none");
      document.getElementById("cntrLoadMinusClick").classList.add("d-none");
      document.getElementById("cntrLoadPlusClick").classList.remove("d-none");
    }
  }
  render() {
    return (
      <>
        {this.props.containerLoadType == "AIR" ||
        this.props.containerLoadType == "LCL" ||
        this.props.containerLoadType == "LTL"
          ? this.CreateMultiCBM()
          : null}
        {this.props.containerLoadType === "FCL" ? this.CreateMultiCBM() : null}

        {this.props.containerLoadType === "FTL"
          ? this.createUITruckType()
          : null}
      </>
    );
  }
}
export default Comman;
