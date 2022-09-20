import { uuidv4 } from "./uuidv4.js";
const modalDiv = document.getElementById("modalDiv");
const registrationFormDiv = document.getElementById("registrationFormDiv");
const loginFormDiv = document.getElementById("loginFormDiv");
const listDiv = document.getElementById("listDiv");
const closeModalBtn = document.getElementById("closeModalButton");
const formBtn = document.getElementById("formBtn");
const loginRegisterBtn = document.getElementById("login_register_btn");
const messageH3 = document.getElementById("messageH3");
const loginForm = document.getElementById("loginForm");
const registrationForm = document.getElementById("registrationForm");
const inputs = Array.from(document.querySelectorAll("input"));
let state = {
  lastName: "",
  firstName: "",
  email: "",
  password1: "",
  password2: "",
  password: "",
  message: "",
  users: [],
  editMessage: "",
  isEdit: false,
  modalOpen: false,
  loginForm: false,
};
let bcrypt = dcodeIO.bcrypt;
const handleInput = (e) => {
  let { name, value } = e.target;
  setState({
    ...state,
    [name]: value,
  });
};
const setInputValues = () => {
  inputs.forEach((input) => {
    let name = input.getAttribute("name");
    input.addEventListener("input", handleInput);
    input.value = state[name];
  });
};
setInputValues();
const setState = (...args) => {
  if (typeof args[0] === "object") {
    let newState = args[0];
    let prevState = state;
    return (state = Object.assign({}, prevState, newState));
  } else if (typeof args[0] === "function") {
    return (function (condition) {
      let newState = args[0](condition);
      return setState(newState);
    })(state);
  } else {
    console.error("State must be a type Object or a function");
  }
};
setState({
  ...state,
  name: "Fred",
});
console.log(state);
setState((prevState) => {
  console.log(prevState);
  return {
    ...state,
    detective: !prevState.detective,
  };
});
const handleRegister = (e) => {
  e.preventDefault();
  if (state.password1 === state.password2) {
    if (state.users.filter((email) => email === state.email).length < 1) {
      let newUser = {};
      newUser.firstName = state.firstName;
      newUser.lastName = state.lastName;
      newUser.id = uuidv4();
      newUser.email = state.email;
      newUser.loggedIn = true;
      newUser.password = bcrypt.hashSync(state.password1, 10);
      setState({
        ...state,
        users: [newUser, ...state.users],
        firstName: "",
        lastName: "",
        email: "",
        password1: "",
        password2: "",
        message: "",
        loggedIn: true,
        modalOpen: false,
      });
      render();
      return;
    } else {
      setState({
        message: "This email is already in the database",
      });
      render();
      return;
    }
  } else {
    setState({
      message: "The passwords do not match",
    });
    render();
    return;
  }
};
registrationForm.addEventListener("submit", handleRegister);
const handleLogin = (e) => {
  e.preventDefault();
  let user = state.users.filter((user) => user.email === state.email)[0];
  if (!user) {
    state.message =
      "This email was not found, please enter another or register";
    render();
    return;
  } else if (!bcrypt.compareSync(state.password, user.password)) {
    setState({
      ...state,
      message: "There was a problem with the password",
    });
    render();
    return;
  } else if (bcrypt.compareSync(state.password, user.password)) {
    setState({
      ...state,
      loggedIn: true,
      message: "",
      email: "",
      password: "",
      modalOpen: false,
    });
    user.loggedIn = state.loggedIn;
    render();
    return;
  } else {
    setState({
      ...state,
      message: "There was a problem",
    });
    render();
    return;
  }
};
loginForm.addEventListener("submit", handleLogin);
const handleMessage = () => {
  if (state.message !== "") {
    messageH3.innerText = "";
    messageH3.innerText = state.message;
    return;
  } else {
    messageH3.innerText = state.message;
  }
};
const handleFormToggle = () => {
  setState((prevState) => {
    return {
      ...state,
      loginForm: !prevState.loginForm,
    };
  });
  render();
  return;
};
const checkFormStatus = () => {
  if (state.loginForm) {
    loginFormDiv.classList.add("hidden");
    registrationFormDiv.classList.remove("hidden");
    formBtn.innerText = "";
    formBtn.innerText = "LOGIN";
  } else {
    loginFormDiv.classList.remove("hidden");
    registrationFormDiv.classList.add("hidden");
    formBtn.innerText = "";
    formBtn.innerText = "REGISTER";
  }
};
formBtn.addEventListener("click", handleFormToggle);
const handleModalToggle = () => {
  setState((prevState) => {
    return {
      ...state,
      modalOpen: !prevState.modalOpen,
      loginForm: false,
    };
  });
  render();
  return;
};
loginRegisterBtn.addEventListener("click", handleModalToggle);
closeModalBtn.addEventListener("click", handleModalToggle);
const checkModalStatus = () => {
  if (!state.modalOpen) {
    modalDiv.classList.add("hidden");
    modalDiv.classList.remove("modal-display")
  } else {
    modalDiv.classList.remove("hidden");
    modalDiv.classList.add("modal-display");
  }
};
checkModalStatus()
const handleLoggout = (id) => {
  let statusChanged = state.users.map((user) => {
    if (user.id === id) {
      user.loggedIn = false;
    }
    return user;
  });
  setState({
    ...state,
    users: statusChanged,
  });
  render();
  return;
};
const handleDeleteUser = (id) => {
  let oneLessUser = state.users.filter((user) => user.id !== id);
  setState({
    ...state,
    users: oneLessUser,
  });
  render();
  return;
};
const handleToggleEdit = (id) => {
  let user = state.users.filter((user) => user.id === id)[0];
  setState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isEdit: true,
    modelOpen: false,
  });
  render();
  return;
};
const handleEditUser = (e) => {
  e.preventDefault();
  //check email
  let offLimits = state.users.filter(user => user.email === state.email && user.id !== state.id)
  if(offLimits.filter(user => user.email === state.email).length > 0){
    //will need to make dynamic message under the form
    setState({
      ...state,
      editMessage: "This email is already in use, please chose another",
    });
    render();
    return;
  } else {
    let youveChanged = state.users.map((user) => {
      if (user.id === state.id) {
        user.firstName = state.firstName;
        user.lastName = state.lastName;
        user.email = state.email;
      }
      return user;
    });
    setState({
      ...state,
      users: youveChanged,
      firstName: "",
      lastName: "",
      email: "",
      id: "",
      editMessage: "",
      isEdit: false,
    });
    render();
    return;
  }
};
const makeList = () => {
  listDiv.innerHTML = "";
  let ul = document.createElement("ul");
  state.users.forEach((user) => {
    let li = document.createElement("li");
    //if statement to find out if editing
    //if editing will have to make a dynamic form
    //form will need a message div to recieve any edit messages
    if (state.isEdit && user.id === state.id) {
      let form = document.createElement("form")
      form.addEventListener("submit", handleEditUser)
      let firstNameLabel = document.createElement("label")
      firstNameLabel.htmlFor = "editFirstName"
      firstNameLabel.innerText = "First Name"
      let firstNameInput = document.createElement("input")
      firstNameInput.setAttribute("id", "editFirstName")
      firstNameInput.setAttribute("name", "firstName")
      firstNameInput.value = state.firstName
      firstNameInput.addEventListener("input", handleInput)
      form.append(firstNameLabel)
      form.append(firstNameInput)
      let lastNameLabel = document.createElement("label")
      lastNameLabel.htmlFor = "editLastName"
      lastNameLabel.innerText = "Last Name"
      let lastNameInput = document.createElement("input")
      lastNameInput.setAttribute("id", "editLastName")
      lastNameInput.setAttribute("name", "lastName")
      lastNameInput.value = state.lastName
      lastNameInput.addEventListener("input", handleInput)
      form.append(lastNameLabel)
      form.append(lastNameInput)
      let emailLabel = document.createElement("label")
      emailLabel.htmlFor = "editEmail"
      emailLabel.innerText = "Email"
      let emailInput = document.createElement("input")
      emailInput.setAttribute("id", "editEmail")
      emailInput.setAttribute("name", "email")
      emailInput.value = state.email
      emailInput.addEventListener("input", handleInput)
      form.append(emailLabel)
      form.append(emailInput)
      let subBut = document.createElement("button")
      subBut.setAttribute("type", "text")
      subBut.innerText = "SAVE CHANGES"
      form.append(subBut)
      li.append(form)
      let messageDiv = document.createElement("div")
      li.append(messageDiv)
      let messageh4 = document.createElement("h4")
      messageh4.innerText = state.editMessage
      messageDiv.append(messageh4)
      ul.append(li)
    } else {
      li.innerHTML = `<h4>${user.firstName} ${user.lastName}</h4><h5>STATUS: ${
        user.loggedIn ? "<span style='color:green;'>LOGGED IN</span><h5>" : "<span style='color:red;'>LOGGED OUT</span><h5>"
      }`;
      if (user.loggedIn) {
        let loggoutBtn = document.createElement("button");
        loggoutBtn.innerText = "LOG OUT";
        loggoutBtn.addEventListener("click", () => handleLoggout(user.id));
        li.append(loggoutBtn);
      }
      let deleteBtn = document.createElement("button");
      deleteBtn.innerText = "DELETE USER";
      deleteBtn.addEventListener("click", () => handleDeleteUser(user.id));
      li.append(deleteBtn);
      let editBtn = document.createElement("button");
      editBtn.innerText = "EDIT";
      editBtn.addEventListener("click", () => handleToggleEdit(user.id));
      li.append(editBtn); 
      ul.append(li);
    }
    //here append buttons for logging out,  deleting and editing user
    //also remember that here you have access to user.id so can set eventListeners for functions that require an id
   
  });
  listDiv.append(ul);
};
const render = () => {
  console.log("from render ", state);
  checkFormStatus();
  checkModalStatus();
  handleMessage();
  makeList();
  setInputValues();
};
