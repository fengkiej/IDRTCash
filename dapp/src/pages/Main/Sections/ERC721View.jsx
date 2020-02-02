import React from "react";
import Carousel from "react-slick";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import carouselStyle from "assets/jss/material-kit-react/views/componentsSections/carouselStyle.jsx";

class ERC721View extends React.Component {
  constructor (props) {
    super(props)

    const {drizzle, drizzleState} = this.props;

    const contract = drizzle.contracts.IDRTCashV1;
    const ownedKey = contract.methods.getOwnedTokens.cacheCall(drizzleState.accounts[0]);

    this.state = {
      ownedKey: ownedKey,
      tokenLength: 0,
    }
  }

  render() {
    var tokenIdMapping = []
    const {classes } = this.props;
    const {drizzleState} = this.props;

    const { IDRTCashV1 } = drizzleState.contracts;
    const tokenIds = IDRTCashV1.getOwnedTokens[this.state.ownedKey];
    if (tokenIds && tokenIds.value) {
      if(tokenIds.value.length !== this.state.tokenLength) {
        this.state.tokenLength = tokenIds.value.length;
        this.slick.slickGoTo(tokenIds.value.length);
        if(this.state.tokenLength === 0) sessionStorage.selectedTokenId = 0;
      }
    }
    const settings = {
      dots: true,
      className: "center",
      centerMode: true,
      lazyLoad: true,
      focusOnSelected:true,
      centerPadding: "100px",
      swipeToSlide: true,
      beforeChange: (current,next) => sessionStorage.selectedTokenId = tokenIdMapping[next],
      slidesToShow: 1,
      infinite: false,
      speed: 500,
    };
    return (
      <div style={{marginTop: '30px'}} className={classes.section}>
        <Card>
          <CardHeader color="primary">Owned IDRTCash</CardHeader>
          <CardBody>
              <Card carousel>
                <Carousel ref={slick => this.slick = slick} {...settings}>
                  {
                    (tokenIds && tokenIds.value && tokenIds.value.length > 0) ? 
                      tokenIds.value.map(function(tokenId){
                        tokenIdMapping.push(tokenId)
                        return <div key={tokenId}><img alt={tokenId} className='slick-image' src={`/static/images/${ tokenId }.svg`}/></div>;
                      }) : <div><h4>You have no IDRTCash yet, please mint on the left menu</h4></div>
                  }
                </Carousel>
              </Card>
            </CardBody>
          </Card>
      </div>
    );
  }
}

export default withStyles(carouselStyle)(ERC721View);
// => this.props.selectedTokenId = tokenId