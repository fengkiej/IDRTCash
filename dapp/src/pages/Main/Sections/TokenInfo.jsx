import Web3Utils from "web3-utils"
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import Send from "@material-ui/icons/Send";
import Whatshot from "@material-ui/icons/Whatshot";

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";
class TokenInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressTo: null,
    }
  }
  render() {
    const { drizzle, drizzleState, classes } = this.props;
    const {IDRTCashV1} = drizzle.contracts;

    return (
        <div style={{marginTop: '-52px'}} className={classes.section}>
          <CustomTabs
            headerColor="primary"
            tabs={[
              {
                tabName: "Transfer",
                tabIcon: Send,
                tabContent: (
                  <div>
                      <CustomInput
                        labelText="TokenId"
                        id="tokenId"
                        className={classes.muted}
                        inputProps={{
                          disabled: true,
                          value: Web3Utils.toHex(sessionStorage.selectedTokenId),
                          multiline: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                        }}
                      />
                      <CustomInput
                        labelText="Address To"
                        id="to"
                        inputProps={{
                          onChange: (e) => {this.setState({addressTo: e.target.value})}
                        }}
                        formControlProps={{
                          fullWidth: true
                        }}
                      />
                    <Button color="primary" block round onClick={() => {
                      if (this.state.addressTo.length === 42) 
                        IDRTCashV1.methods.transferFrom.cacheSend(drizzleState.accounts[0], this.state.addressTo, sessionStorage.selectedTokenId);
                      }
                    }>
                      Transfer
                    </Button>
                  </div>
                )
              },
              {
                tabName: "Burn",
                tabIcon: Whatshot,
                tabContent: (
                  <div>
                    <CustomInput
                      labelText="TokenId"
                      id="tokenId"
                      className={classes.muted}
                      inputProps={{
                        disabled: true,
                        value: Web3Utils.toHex(sessionStorage.selectedTokenId),
                        multiline: true,
                      }}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <Button color="primary" block round onClick={() => IDRTCashV1.methods.burn.cacheSend(sessionStorage.selectedTokenId)} >
                      Burn
                    </Button>
                  </div>
                )
              },
            ]}
          />
        </div>
    );
  }
}

export default withStyles(basicsStyle)(TokenInfo);
