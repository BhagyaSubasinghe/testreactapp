import { Grid } from "@mui/material";

const UserForm = (props) => {
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Enter User Details</h1>
                    <form onSubmit={props.onSubmit}>
                        <input type="text" placeholder="Name" value={props.name} onChange={props.onNameChange} />
                        <input type="email" placeholder="Email" value={props.email} onChange={props.onEmailChange} />
                        <button type="submit">Submit</button>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default UserForm;