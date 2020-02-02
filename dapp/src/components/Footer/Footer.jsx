/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/fengkiej"
                className={classes.block}
                target="_blank"
              >
                GitHub
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.linkedin.com/in/fengkiej/"
                className={classes.block}
                target="_blank"
              >
                LinkedIn
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://twitter.com/fengkiej"
                className={classes.block}
                target="_blank"
              >
                Twitter
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()}, FengkieJ.
          <br /> Made for <a href="https://learn.consensys.net/index">Consensys Academy</a> Final Project    
          <br /> Theme: Material Kit React by <a href="https://creative-tim.com">Creative Tim</a>
          & Gatsby Material Kit React by <a href="https://github.com/WebCu/gatsby-material-kit-react">WebCu</a>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
