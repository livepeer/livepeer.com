import { useEffect, useState, Fragment } from "react";
import { useApi } from "../../hooks";
import { Box, Button, H3 } from "@theme-ui/components";
import Modal from "../Modal";
import Textfield from "../Textfield";

export default ({ userId }) => {
  const [tokens, setTokens] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const { getApiTokens, createApiToken, deleteApiToken } = useApi();
  useEffect(() => {
    getApiTokens(userId).then(tokens => setTokens(tokens));
  }, [userId, newToken, deleteModal]);
  const close = () => {
    setCreateModal(false);
    setDeleteModal(false);
    setTokenName("");
    setNewToken(null);
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto"
      }}
    >
      {createModal && (
        <Modal onClose={close}>
          {!newToken && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (creating) {
                  return;
                }
                setCreating(true);
                createApiToken({ name: tokenName })
                  .then(newToken => {
                    setNewToken(newToken);
                    setCreating(false);
                  })
                  .catch(e => {
                    setCreating(false);
                  });
              }}
            >
              <h3>Create token</h3>
              <p>
                Enter a name for your token to differentiate it from other
                tokens.
              </p>
              <Textfield
                label="Name"
                value={tokenName}
                onChange={e => setTokenName(e.target.value)}
              ></Textfield>
              <Box>
                <Button type="button" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit">Create Token</Button>
              </Box>
            </form>
          )}
          {newToken && (
            <Box>
              <h5>Token created</h5>
              <p>Please copy your token and store it in a safe place.</p>
              <p>
                <strong>
                  For security reasons, it will not be shown again.
                </strong>
              </p>
              <Box>
                <pre>
                  <code
                    onClick={() => {
                      navigator.clipboard.writeText(newToken.id);
                    }}
                  >
                    {newToken.id}
                  </code>
                </pre>
              </Box>
              <Button type="button" onClick={close}>
                Close
              </Button>
            </Box>
          )}
        </Modal>
      )}
      {deleteModal && selectedToken && (
        <Modal onClose={close}>
          <h5>Are you sure you want to delete token {selectedToken.name}?</h5>
          <Button onClick={close}>Cancel</Button>
          <Button
            type="button"
            onClick={() => {
              deleteApiToken(selectedToken.id).then(close);
            }}
          >
            Delete
          </Button>
        </Modal>
      )}
      <p>
        <strong>Note:</strong> These tokens allow other apps to control your
        whole account. Treat them like you would a password.
      </p>
      <Box>
        <Button
          onClick={() => {
            setCreateModal(true);
          }}
        >
          Create
        </Button>
        <Button onClick={() => selectedToken && setDeleteModal(true)}>
          Delete
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto"
        }}
      >
        <Box sx={{ padding: [3, 3], userSelect: "none" }}></Box>
        <Box sx={{ padding: [3, 3], userSelect: "none" }}>Name</Box>
        <Box sx={{ padding: [3, 3], userSelect: "none" }}>Last Active</Box>
        {tokens.map(token => {
          const { id, name } = token;
          const selected = selectedToken && selectedToken.id === id;
          const RowBox = ({ children }) => (
            <Box
              sx={{
                backgroundColor: selected ? "rgba(0,0,0,0.2)" : "transparent",
                cursor: "pointer",
                padding: [3, 3],
                userSelect: "none"
              }}
              onClick={() => {
                if (selected) {
                  setSelectedToken(null);
                } else {
                  setSelectedToken(token);
                }
              }}
            >
              {children}
            </Box>
          );
          return (
            <Fragment key={id}>
              <RowBox>
                <span
                  sx={{
                    visibility: selected ? "visible" : "hidden",
                    position: "absolute"
                  }}
                >
                  ☑️
                </span>
                <span sx={{ visibility: selected ? "hidden" : "visible" }}>
                  ◻️
                </span>
              </RowBox>
              <RowBox>{name}</RowBox>
              <RowBox>2m ago</RowBox>
            </Fragment>
          );
        })}
      </Box>
    </Box>
  );
};