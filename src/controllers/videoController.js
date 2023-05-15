export const trending = (req, res) => {
  return res.render("home");
};

export const search = (req, res) => res.send("search Video"); 

export const watch = (req, res) => {
  const { params: {id} } = req;
  
  return res.send(`Watch ${id} Video`);
}; 

export const edit = (req, res) => {
  const { params: {id} } = req;

  return res.send(`Edit ${id} Video`);
}; 

export const remove = (req, res) => {
  const {params: {id}} = req;

  return res.send(`Remove ${id} Video`);
}; 

export const upload = (req, res) => res.send("Upload Video"); 