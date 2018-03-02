import { Component, UIDialog } from "rainbowui-core";
import { UICascadeSelector } from "rainbowui-cascade-selector";
import PropTypes from 'prop-types';
import { PageContext } from "rainbow-foundation-cache";
import { CodeTableService } from "rainbow-foundation-codetable";
import config from "config";
import { Util } from 'rainbow-foundation-tools'

export default class address extends Component {
    constructor(props) {
        super(props);
        // PageContext.put("Address_CountryCode",this.props.countryCode);
        // console.log("this.props.countryCode===>" + this.props.countryCode);
    }

    componentWillMount() {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    getDefaultValue() {

        let { codeTableArr, valueCodeTableName, value } = this.props
        let CodeTableNameList = []
        for (var i in codeTableArr) {
            CodeTableNameList.push(codeTableArr[i]["tableCode"])
            // if (!lastCodeName) {
            //     if (i == lastValueLevel) {
            //         lastCodeName = codeTableArr[i]["tableCode"]
            //     }
            // }

        }
        return {
        "CodeTableNameList" : CodeTableNameList,
        "LastCodeTableName" : valueCodeTableName,
        "LastCodeTableValue" : value,
        } 

    }


    render() {
        return (
            <UICascadeSelector id={this.props.id} label={this.props.label} datasource={this.getDataSource} model={this.props.model} property={this.props.property} value={this.props.value} widthAllocation={this.props.widthAllocation} codeTableArr={this.props.codeTableArr} defaultValue={this.getDefaultValue()} />
        );
    }

    getDataSource(codeTableArr, firstLevel, secondLevel, thirdLevel, fourthLevel) {
        let lisBody = [];
        let listData = [];
        let level = [];

        let handCodeTableData = (data) => {

            let codeKey = "id"
            let textKey = "name"

            let dataArray = [];
            const codetable_key = config["DEFAULT_CODETABLE_KEYVALUE"]["KEY"];
            const codetable_value = config["DEFAULT_CODETABLE_KEYVALUE"]["VALUE"];
            const codetable_api_key = config["DEFAULT_API_CODETABLE_KEYVALUE"]["KEY"];
            const codetable_api_value = config["DEFAULT_API_CODETABLE_KEYVALUE"]["VALUE"];
            if (data && data.codes && data.codes.length > 0) {
                data.codes.forEach(function (codeItem) {
                    const code = {};
                    code[codeKey] = codeItem[codetable_key];
                    code[textKey] = codeItem[codetable_value];
                    dataArray.push(code);
                });
            } if (data && data.BusinessCodeTableValueList && data.BusinessCodeTableValueList.length > 0) {
                data.BusinessCodeTableValueList.forEach(function (codeItem) {
                    const code = {};
                    code[codeKey] = codeItem[codetable_api_key];
                    code[textKey] = codeItem[codetable_api_value];
                    dataArray.push(code);
                });
            } else if (Util.isArray(data)) {
                data.forEach(function (codeItem) {
                    const code = {};
                    code[codeKey] = codeItem[codetable_api_key];
                    code[textKey] = codeItem[codetable_api_value];
                    dataArray.push(code);
                });
            }
            return dataArray

        }

        let findTable = (codeTableName, conditionMap) => {
            return new Promise(
                (resolve) => {
                    return CodeTableService.getCodeTable({ "CodeTableName": codeTableName, "ConditionMap": conditionMap }).then(function (data) {
                        let result = handCodeTableData(data);
                        if (result) {
                            resolve(result)
                        }
                        else {
                            reject();
                        }
                    }, () => {
                        reject();
                    });
                }
            )

        }


        if (firstLevel == undefined && secondLevel == undefined && thirdLevel == undefined && fourthLevel == undefined) {
            if (codeTableArr.length >= 1) {
                // return findTable("StartCities")//CountryInfo
                let obj = codeTableArr[0]
                level = obj.level;
                return findTable(obj["tableCode"])//CityInfo
            } else {
                return new Promise((resolve) => {
                    resolve(null)
                });
            }
        } else if (firstLevel != undefined && secondLevel == undefined && thirdLevel == undefined && fourthLevel == undefined) {
            level = "provinces";

            if (codeTableArr.length >= 2) {
                // return findTable("StartCitiesCity", { "ProvinceCode": firstLevel })//ProvinceInof
                let obj = codeTableArr[1]
                level = obj.level;
                let condition = {}
                condition[obj.conditionName] = firstLevel
                return findTable(obj["tableCode"], condition)//CityInfo
            } else {
                return new Promise((resolve) => {
                    resolve(null)
                });
            }
        } else if (firstLevel != undefined && secondLevel != undefined && thirdLevel == undefined && fourthLevel == undefined) {
            if (codeTableArr.length >= 3) {

                let obj = codeTableArr[2]
                level = obj.level;
                let condition = {}
                condition[obj.conditionName] = secondLevel
                return findTable(obj["tableCode"], condition)//CityInfo
            } else {
                return new Promise((resolve) => {
                    resolve(null)
                });
            }
        }
        else if (firstLevel != undefined && secondLevel != undefined && thirdLevel != undefined && fourthLevel == undefined) {
            level = "areas";
            if (codeTableArr.length >= 4) {
                // return findTable("StartCitiesArea", { "CityCode": thirdLevel })//AreaInfo
                let obj = codeTableArr[3]
                level = obj.level;
                let condition = {}
                condition[obj.conditionName] = thirdLevel
                return findTable(obj["tableCode"], condition)//CityInfo
            } else {
                return new Promise((resolve) => {
                    resolve(null)
                });
            }

        } else if (firstLevel != undefined && secondLevel != undefined && thirdLevel != undefined && fourthLevel != undefined) {
            level = "street";

            if (codeTableArr.length >= 5) {
                // return findTable("StartCitiesArea", { "AreaCode": fourthLevel })//StreetTownCode
                let obj = codeTableArr[4]
                level = obj.level;
                let condition = {}
                condition[obj.conditionName] = fourthLevel
                return findTable(obj["tableCode"], condition)//CityInfo
            } else {
                return new Promise((resolve) => {
                    resolve(null)
                });
            }
        }
    }
}


/**
 * Address component prop types
 */
address.propTypes = $.extend({}, Component.defaultProps, {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    valueCodeTableName: PropTypes.string,
    widthAllocation: PropTypes.string,
    codeTableArr: PropTypes.array
});


