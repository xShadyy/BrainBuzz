import {StyleSheet} from 'react-native';

export const HEADER_HEIGHT = 120;
export const ICON_SIZE = 46;
export const GRID_GAP = 10;
export const PADDING = 20;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#282828',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272727',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
  },
  dashboardLayout: {flex: 1},
  scrollView: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
  },
  contentContainer: {
    padding: PADDING,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingTop: 30,
    marginHorizontal: -GRID_GAP / 2,
  },
  gridItem: {
    width: `${50 - GRID_GAP / 2}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 0.2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginHorizontal: GRID_GAP / 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    marginTop: 10,
    fontFamily: 'Lexend-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
