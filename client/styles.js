export const colors={
  backgroundMain:"#FFF",
  primary:"#161D37",
  backgroundCard:"#FFF",
  error:"#293749"
}
export const styles = {
  CompanyDetails: {
    padding: 40,
    backgroundColor: colors.backgroundCard,
    shadowColor: "#000",
    width: "90%",
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadoOffset: {
      width: 0,
      height: 1
    },
    alignSelf: "center",
    justifyContent:'space-between',
    paddingBottom:200,
    marginVertical: 20,
    flex: 1
  },
  carCard: {
    padding: 20,
    backgroundColor: colors.backgroundCard,
    shadowColor: "#000",
    width: "100%",
    height: 240,
    alignSelf: "center",
    flexDirection:'column',
    
    alignItems:'center',
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
    fontFamily:'Avenir'
  },
  button: {
    alignItems: "center",
    height: 52,
    backgroundColor: colors.primary,
    borderStyle: "solid",
    borderRadius: 40,
    borderWidth: 0,
    marginBottom: 10,
  },
  buttonSignOut: {
    alignItems: "center",
    height: 52,
    backgroundColor:colors.error,
    borderStyle: "solid",
    borderColor: "#F08080",
    borderWidth: 1,
    padding: 15,
    borderRadius:100,
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
    marginHorizontal: 40,
  },
  avatar: {
    borderColor: "#90F6DE",
    borderRadius: "50px",
    borderWidth: "1",
    width: 70,
    height: 70,
    backgroundColor: "#3D4858",
    padding: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    padding: 20,
    flex:1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#1C2632"
  },
  container2: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  }
};