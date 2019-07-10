import { Platform } from "react-native";
export const colors = {
  backgroundMain: "#fafaff",
  primary: "#161D37",
  backgroundCard: "#FFF",
  error: "#293749"
};
export const styles = {
  CompanyDetails: {
    padding: 40,
    backgroundColor: colors.backgroundCard,
    shadowColor: "#000",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    justifyContent: "space-between",
    flex: 1
  },
  carCard: {
    padding: 20,
    backgroundColor: colors.backgroundCard,
    shadowColor: "#000",
    width: "100%",
    height: 240,
    alignSelf: "center",
    flexDirection: "column",

    alignItems: "center",
    flex: 1
  },
  circle: { width: 25, height: 25, borderRadius: 15, borderWidth: 5 },
  rectangle: { width: 50, height: 5 },

  text: {
    height: 50,
    borderStyle: "solid",
    borderBottomColor: "#74808E",
    borderBottomWidth: 1,
    // borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
    color: "#000",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto"
  },
  button: {
    alignItems: "center",
    height: 52,
    backgroundColor: colors.primary,
    borderStyle: "solid",
    borderRadius: 40,
    borderWidth: 0,
    marginBottom: 10
  },
  buttonSignOut: {
    alignItems: "center",
    height: 52,
    backgroundColor: colors.error,
    borderStyle: "solid",
    borderColor: "#F08080",
    borderWidth: 1,
    padding: 15,
    borderRadius: 100,
    marginBottom: 10,
    marginHorizontal: 40,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadoOffset: {
      height: 3
    }
  },
  buttonError: {
    alignItems: "center",
    height: 52,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "#FF0000",
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 40
  },
  avatar: {
    borderColor: "#C0C5D8",
    borderRadius: 50,
    borderWidth: 3,
    width: 70,
    height: 70,
    margin: 20,
    marginBottom: 5,
    backgroundColor: colors.primary,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  container: {
    padding: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container2: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  }
};
