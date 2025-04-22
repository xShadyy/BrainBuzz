import {StyleSheet, Platform, StatusBar} from 'react-native';

// Get the status bar height for proper padding
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828',
  },
  headerContainer: {
    backgroundColor: 'rgb(43, 43, 43)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 10, // Add padding for status bar + original padding
    paddingHorizontal: 16,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(255, 200, 0)',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Lexend-SemiBold',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30, // Add padding to the bottom so content doesn't extend to edge
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(60, 60, 60, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 242, 0.15)',
  },
  fieldContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    fontFamily: 'Lexend-Regular',
  },
  fieldValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    flex: 1,
    textAlign: 'right',
  },
  fieldNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editButton: {
    marginRight: 8,
    padding: 4,
  },
  editNameContainer: {
    marginTop: 12,
  },
  editNameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 242, 0.25)',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 204, 0.25)',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 242, 0.5)',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
    textShadowColor: '#FFD3F4',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 100, 0.4)',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
  },
  animationProgressContainer: {
    marginTop: 20,
    marginBottom: 16,
    padding: 16,
    paddingBottom: 8, // Reduced bottom padding to close container right at the last fire animation
    backgroundColor: 'rgba(60, 60, 60, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 201, 242, 0.15)',
  },
  animationProgressTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    marginBottom: 16,
  },
  levelRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    height: 50,
  },
  animationContainer: {
    width: 50,
    height: 50,
  },
  progressBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#444444',
    borderRadius: 10,
    marginHorizontal: 12,
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  checkpointMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: '50%',
    marginTop: -4,
  },
  levelNameContainer: {
    minWidth: 100,
  },
  levelName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    textAlign: 'left',
  },

  scrollEndSpacer: {
    height: 20, // Reduced height to minimize empty space
  },
});
