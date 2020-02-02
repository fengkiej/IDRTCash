import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

class ERC20Info extends React.Component {
  constructor(props) {
    super(props);

    const {drizzle, drizzleState} = this.props;

    const contract = drizzle.contracts.ERC20IDRTSample;
    const balanceKey = contract.methods.balanceOf.cacheCall(drizzleState.accounts[0]);

    this.state = {
      balanceKey: balanceKey
    }
  }

  render() {
    const { drizzle, drizzleState, classes } = this.props;
    const { ERC20IDRTSample } = drizzleState.contracts;
    const account = drizzleState.accounts[0];
    const balance = ERC20IDRTSample.balanceOf[this.state.balanceKey];

    return (
      <div style={{marginTop: '-52px'}}  className={classes.sections}>
          <Card>
            <CardHeader color="primary">
                ERC20 IDRT
            </CardHeader>
            <CardBody>
                <p>
                  Balance: { (balance && balance.value)/10**2 }
                </p>
                <Button onClick={() => drizzle.contracts.ERC20IDRTSample.methods.mint.cacheSend(account, 100000000)} color="primary" block round>
                  Mint
                </Button>
            </CardBody>
          </Card>
        </div>
    );
  }
}

export default withStyles(basicsStyle)(ERC20Info);
