import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Platform,
  Dimensions
} from 'react-native';
import { _constructStyles, _getElementClassStyles } from './HTMLStyles';
import HTMLImage from './HTMLImage';
import TouchableCard from '../../../src/components/TouchableCard';

import WebView from 'react-native-android-fullscreen-webview-video';

export function a(htmlAttribs, children, convertedCSSStyles, passProps) {
  const style = _constructStyles({
    tagName: 'a',
    htmlAttribs,
    passProps,
    styleSet: passProps.parentWrapper === 'Text' ? 'TEXT' : 'VIEW'
  });
  // !! This deconstruction needs to happen after the styles construction since
  // the passed props might be altered by it !!
  const { parentWrapper, onLinkPress, key, data } = passProps;
  const onPress = (evt) =>
    onLinkPress && htmlAttribs && htmlAttribs.href
      ? onLinkPress(evt, htmlAttribs.href, htmlAttribs)
      : undefined;

  if (parentWrapper === 'Text') {
    return (
      <Text {...passProps} style={style} onPress={onPress} key={key}>
        {children || data}
      </Text>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} key={key}>
        {children || data}
      </TouchableOpacity>
    );
  }
}

export function img(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
  if (!htmlAttribs.src) {
    return false;
  }

  const style = _constructStyles({
    tagName: 'img',
    htmlAttribs,
    passProps,
    styleSet: 'IMAGE'
  });
  const { src, alt, width, height } = htmlAttribs;

  return (
    <HTMLImage
      source={{ uri: `${src}?w=${Dimensions.get('window').width}` }}
      alt={alt}
      width={width}
      height={height}
      style={style}
      {...passProps}
    />
  );
}

export function ul(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
  const style = _constructStyles({
    tagName: 'ul',
    htmlAttribs,
    passProps,
    styleSet: 'VIEW'
  });
  const {
    allowFontScaling,
    rawChildren,
    nodeIndex,
    key,
    baseFontStyle,
    listsPrefixesRenderers
  } = passProps;
  const baseFontSize = baseFontStyle.fontSize || 14;

  children =
    children &&
    children.map((child, index) => {
      const rawChild = rawChildren[index];
      let prefix = false;
      const rendererArgs = [
        htmlAttribs,
        children,
        convertedCSSStyles,
        {
          ...passProps,
          index
        }
      ];

      if (rawChild) {
        if (rawChild.parentTag === 'ul' && rawChild.tagName === 'li') {
          prefix =
            listsPrefixesRenderers && listsPrefixesRenderers.ul ? (
              listsPrefixesRenderers.ul(...rendererArgs)
            ) : (
              <View
                style={{
                  marginRight: 10,
                  width: baseFontSize / 2.8,
                  height: baseFontSize / 2.8,
                  marginTop: baseFontSize / 1.3,
                  borderRadius: baseFontSize / 2.8,
                  backgroundColor: '#888C9C'
                }}
              />
            );
        } else if (rawChild.parentTag === 'ol' && rawChild.tagName === 'li') {
          prefix =
            listsPrefixesRenderers && listsPrefixesRenderers.ol ? (
              listsPrefixesRenderers.ol(...rendererArgs)
            ) : (
              <Text
                allowFontScaling={allowFontScaling}
                style={{ marginRight: 5, fontSize: baseFontSize }}
              >
                {index + 1})
              </Text>
            );
        }
      }
      return (
        <View
          key={`list-${nodeIndex}-${index}-${key}`}
          style={{ flexDirection: 'row', marginBottom: 10 }}
        >
          {prefix}
          <View style={{ flex: 1 }}>{child}</View>
        </View>
      );
    });
  return (
    <View style={style} key={key}>
      {children}
    </View>
  );
}
export const ol = ul;

export function iframe(htmlAttribs, children, convertedCSSStyles, passProps) {
  // const { staticContentMaxWidth, tagsStyles, classesStyles } = passProps;

  // const tagStyleHeight = tagsStyles.iframe && tagsStyles.iframe.height;
  // const tagStyleWidth = tagsStyles.iframe && tagsStyles.iframe.width;

  // const classStyles = _getElementClassStyles(htmlAttribs, classesStyles);
  // const classStyleWidth = classStyles.width;
  // const classStyleHeight = classStyles.height;

  // const attrHeight = htmlAttribs.height ? parseInt(htmlAttribs.height) : false;
  // const attrWidth = htmlAttribs.width ? parseInt(htmlAttribs.width) : false;

  // const height = `${htmlAttribs}?w=${Dimensions.get('window').height}`;
  // const height = attrHeight || classStyleHeight || tagStyleHeight || 225;
  // const width =
  //   attrWidth || classStyleWidth || tagStyleWidth || staticContentMaxWidth;

  const screenWidth = Math.round(Dimensions.get('window').width);
  const width = screenWidth - 30;
  const ratio = 1.78;
  const height = width / ratio;

  // 1.78 youtube ratio 16/9

  const style = _constructStyles({
    tagName: 'iframe',
    htmlAttribs,
    passProps,
    styleSet: 'VIEW',
    additionalStyles: [{ height, width }]
  });

  const formatWebsiteURL = (website) => {
    if (!website.toString().includes('https:')) {
      return `https:${website}`;
    } else {
      return website;
    }
  };

  const source = htmlAttribs.srcdoc
    ? { html: formatWebsiteURL(htmlAttribs.srcdoc) }
    : { uri: formatWebsiteURL(htmlAttribs.src) };

  return (
    <WebView
      key={passProps.key}
      source={source}
      style={[style, { opacity: 0.99, alignSelf: 'center' }]}
    />
  );
}

export function pre(htlmAttribs, children, convertedCSSStyles, passProps) {
  return (
    <Text
      key={passProps.key}
      style={{ fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo' }}
    >
      {children}
    </Text>
  );
}

export function br(htlmAttribs, children, convertedCSSStyles, passProps) {
  return (
    <Text
      allowFontScaling={passProps.allowFontScaling}
      style={{ height: 1.2 * passProps.emSize, flex: 1 }}
      key={passProps.key}
    >
      {/* {'\n'} */}
    </Text>
  );
}

export function blockquote(
  htmlAttribs,
  children,
  convertedCSSStyles,
  passProps
) {
  // console.log(children);

  return children.map((child) => {
    console.log(child);

    if (
      child[0] &&
      child[0].props &&
      child[0].props.children[1] &&
      child[0].props.children[1][0] &&
      child[0].props.children[1][0][0] &&
      child[0].props.children[1][0][0].props &&
      child[0].props.children[1][0][0].props.rawChildren &&
      child[0].props.children[1][0][0].props.rawChildren[0]
    ) {
      const linkTitle =
        child[0].props.children[1][0][0].props.rawChildren[0].data;
      const linkUrl =
        child[0].props.children[1][0][0].props.rawChildren[0].parent.attribs
          .href;

      if (linkTitle && linkUrl) {
        return (
          <TouchableCard
            linkTitle={
              child[0].props.children[1][0][0].props.rawChildren[0]
                ? linkTitle
                : linkUrl
            }
            websiteLink={linkUrl}
          />
        );
      } else {
        null;
      }
    }
  });
}

export function textwrapper(
  htmlAttribs,
  children,
  convertedCSSStyles,
  { allowFontScaling, key }
) {
  return (
    <Text
      allowFontScaling={allowFontScaling}
      key={key}
      style={convertedCSSStyles}
    >
      {children}
    </Text>
  );
}
