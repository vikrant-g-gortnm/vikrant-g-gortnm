import React from "react";

// Styles
import styles from "./Buttons.module.css";
import classnames from "classnames";

//sizes
function getSizeClass(size) {
  switch (size) {
    case "large":
      return styles.large_button;
    case "large1":
      return styles.large_button1;
    case "medium":
      return styles.medium_button;
    case "medium1":
      return styles.medium_button_share;
    case "medium2":
      return styles.medium_button2;
    case "small":
      return styles.small_button;
    case "small1":
      return styles.small_button_back;
    case "small2":
      return styles.small2_button;
    case "extra-small":
      return styles.extra_small_button;
    case "extra-small1":
      return styles.extra_small_button1;
    case "text-button":
      return styles.text_button;
    default:
      return styles.large_button;
  }
}

//button styles
function getButtonStyle(buttonStyle) {
  switch (buttonStyle) {
    case "primary":
      return styles.primary_color;
    case "secondary":
      return styles.secondary_color;
    case "gray":
      return styles.gray_button;
    case "white":
      return styles.white_button;
    default:
      return styles.primary_color;
  }
}

//Hover
function getHover(hover) {
  switch (hover) {
    case "primary_hover":
      return styles.primary_hover;
    case "secondary_hover":
      return styles.secondary_hover;
    case "gray_hover":
      return styles.gray_hover;
    case "white_hover":
      return styles.white_hover;
    default:
      return "";
  }
}
//text style
function getTextStyle(textStyle) {
  switch (textStyle) {
    case "primary_text":
      return styles.primary_text;
    case "secondary_text":
      return styles.secondary_text;
    case "gray_text":
      return styles.gray_text;
    case "white_text":
      return styles.white_text;
    default:
      return "";
  }
}

// * MAIN FUNCTION *
export function Button({
  textStyle,
  type,
  hover,
  buttonStyle,
  size,
  loading,
  onClick,
  iconClass,
  style,
  ...children
}) {
  // Default fallback with empty function
  // if no click function is defined
  onClick = onClick || (() => {});

  let withIconPadding = loading || type === "right_arrow" || iconClass;

  // const sizeClass = getSizeClass(size)

  return (
    <button
      className={classnames(
        // sizeClass,
        styles.button_container,
        withIconPadding && styles.icon_padding,
        getSizeClass(size),
        getButtonStyle(buttonStyle),
        getHover(hover),
        getTextStyle(textStyle)
      )}
      style={style || {}}
      onClick={onClick}
    >
      <div {...children} />

      {/* check-icon */}
      {type === "check" && !loading && (
        <span className={styles.check_icon}>
          <i className="far fa-check" />
        </span>
      )}

      {/* plus-icon */}
      {type === "plus" && !loading && (
        <span className={styles.plus_icon}>
          <i className="fal fa-plus" />
        </span>
      )}

      {/* right_arrow-icon */}
      {type === "right_arrow" && !loading && (
        <span className={styles.right_icon}>
          <i className="fal fa-chevron-right" />
        </span>
      )}

      {/* left_arrow-icon */}
      {type === "left_arrow" && !loading && (
        <span className={styles.left_icon}>
          <i className="fal fa-chevron-left" />
        </span>
      )}

      {/* angle_up-icon */}
      {type === "angle_up" && !loading && (
        <span className={styles.angleup_icon}>
          <i className="far fa-angle-up" />
        </span>
      )}

      {/* angle_down-icon */}
      {type === "angle_down" && !loading && (
        <span className={styles.angledown_icon}>
          <i className="far fa-angle-down" />
        </span>
      )}

      {/* loading-icon */}
      {loading && (
        <span className={styles.loading_icon}>
          <i className="fa fa-spinner fa-spin" />
        </span>
      )}
    </button>
  );
}
