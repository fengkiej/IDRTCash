import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

class ERC721Mint extends React.Component {
  constructor(props) {
    super(props);

    const {drizzle, drizzleState} = this.props;
    const {ERC20IDRTSample, IDRTCashV1, Lighthouse} = drizzle.contracts;

    const allowanceKey = ERC20IDRTSample.methods.allowance.cacheCall(drizzleState.accounts[0], IDRTCashV1.address);
    const nonceKey = Lighthouse.methods.peekLastNonce.cacheCall();

    this.state = {
      allowanceKey: allowanceKey,
      nonceKey: nonceKey,
      isEnabled: false,
      mintAmount: 0
    };

    drizzle.contracts.IDRTCashV1.events
      .Transfer({filter: {from: '0x0000000000000000000000000000000000000000', to: drizzleState.accounts[0]}
      }).on('data', (event) => {
        const tokenId = event.returnValues.tokenId;
        fetch(`/.netlify/functions/generate-metadata?tokenId=${ tokenId }`);
      });
  }

  render() {
    const { drizzle, drizzleState, classes } = this.props;
    const { ERC20IDRTSample, Lighthouse } = drizzleState.contracts;

    const enabled = ERC20IDRTSample.allowance[this.state.allowanceKey];
    const lastNonce = Lighthouse.peekLastNonce[this.state.nonceKey];

    this.state.isEnabled= (enabled && Number(enabled.value) > 0) || false;
    return (
      <div style={{marginTop: '30px'}} className={classes.sections}>
          <Card>
            <CardHeader color="primary">
                Mint IDRTCash
            </CardHeader>
            <CardBody>
              <FormControlLabel
                control={
                    <Switch
                      checked={this.state.isEnabled}
                      onChange={() => {
                        if(!this.state.isEnabled) {
                          drizzle.contracts.ERC20IDRTSample.methods.approve.cacheSend(`${drizzle.contracts.IDRTCashV1.address}`, Number.MAX_SAFE_INTEGER)
                        } else {
                          drizzle.contracts.ERC20IDRTSample.methods.approve.cacheSend(`${drizzle.contracts.IDRTCashV1.address}`, 0)
                        }
                      }}
                      classes={{
                        switchBase: classes.switchBase,
                        checked: classes.switchChecked,
                        icon: classes.switchIcon,
                        iconChecked: classes.switchIconChecked,
                        bar: classes.switchBar
                      }}
                    />
                }
                classes={{
                  label: classes.label
                }}
                label="Enable IDRT"
              />
                
                <CustomInput
                  labelText="Amount"
                  id="amount"
                  inputProps={{
                    onChange: (e) => {this.setState({mintAmount: e.target.value})}
                  }}
                  formControlProps={{
                    fullWidth: true
                  }}
                />
                <Button onClick={() => { 
                      drizzle.contracts.IDRTCashV1.methods.mint.cacheSend(`${this.state.mintAmount * 10 ** 2}`);
                      
                      if(drizzleState && drizzleState.web3.networkId > 4)
                        drizzle.contracts.Lighthouse.methods.write.cacheSend(`0`, `${Number(lastNonce.value.v) + 1}`);
                    } 
                  } color="primary" block round>
                  Mint
                </Button>
            </CardBody>
          </Card>
        </div>
    );
  }
}

export default withStyles(basicsStyle)(ERC721Mint);
