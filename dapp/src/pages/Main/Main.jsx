import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import { Loader } from 'rimble-ui';
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import ERC721Mint from "./Sections/ERC721Mint.jsx";
import TokenInfo from "./Sections/TokenInfo.jsx";
import ERC721View from "./Sections/ERC721View.jsx";
import ERC20Info from "./Sections/ERC20Info.jsx";
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import { EthAddress } from "rimble-ui";

import drizzleOptions from "./../../drizzleOptions";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);


class Main extends React.Component {
  render() {
    const { classes, ...rest } = this.props;
    return (
    <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
            
            {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;
            if(!initialized) return <Loader />

            return (
                <div>
                    <Header
                        brand="IDRTCash"
                        rightLinks={initialized? <EthAddress address={drizzleState.accounts[0]} /> : <Loader />}
                        fixed
                        color="white"
                        {...rest}
                    />

                    <div className={classNames(classes.main)}>
                        <div className={classes.container}>
                            <GridContainer justify="center">
                                <GridItem xs={12} sm={12} md={4}>
                                    <ERC721Mint  drizzle={drizzle} drizzleState={drizzleState} />
                                    <TokenInfo drizzle={drizzle} drizzleState={drizzleState} />
                                    <ERC20Info drizzle={drizzle} drizzleState={drizzleState} />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={8}>
                                    <ERC721View  drizzle={drizzle} drizzleState={drizzleState} />
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                    <Footer />
                </div>
            );
            }}
        </DrizzleContext.Consumer>

    </DrizzleContext.Provider>
    );
    }
}

export default withStyles(componentsStyle)(Main);
