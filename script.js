const serverUrl = "";     // Moralis server URL 
const appId = "";         // Moralis APP ID
Moralis.start({ serverUrl, appId });
Moralis.enableWeb3();

let user = Moralis.User.current();

const loginButton = document.querySelector("#login_button");
const logOutButton = document.querySelector("#logout_button");
const donateButton = document.querySelector("#donate_button");

loginButton.addEventListener("click", async () => {
  try {
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Authenticate" });
      console.log(user);
      console.log(user.get("ethAddress"));
    }
  } catch (error) {
    console.error(error);
  }
  await checkUser();
});

logOutButton.addEventListener("click", async () => {
  await Moralis.User.logOut();
  user = null;
  console.log("User logged out");
  checkUser();
});

donateButton.addEventListener("click", async () => {
  const amount = parseFloat(
    document.querySelector("#donation_amount").value || 0.1
  );
  const message = document.querySelector("#donation_note").value;

  let options = {
    contractAddress: "0xB626fC9D3d433F0e88024BCf60D45Bf92471147a",
    functionName: "newDonation",
    abi: [
      {
        inputs: [{ internalType: "string", name: "_note", type: "string" }],
        name: "newDonation",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    params: {
      _note: message,
    },
    msgValue: Moralis.Units.ETH(amount),
  };
  await Moralis.executeFunction(options);
});

async function checkUser() {
  if (user) {
    loginButton.style.display = "none";
    logOutButton.style.display = "block";
    document.querySelector("#donation_form").style.display = "block";
  } else {
    document.querySelector("#donation_form").style.display = "none";
    loginButton.style.display = "block";
    logOutButton.style.display = "none";
  }
}

checkUser();
