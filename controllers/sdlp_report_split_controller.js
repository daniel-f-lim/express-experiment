import fs from 'fs';

const data = {};
const json_data = JSON.parse(fs.readFileSync('model/data.json'));

data.report_splits = json_data;

export const get_sdlp_report_split = (req, res) => {
	res.json(json_data);
}

export const post_sdlp_report_split = (req, res) => {
	res.json({
		"firstname": req.body.firstname,
		"lastname": req.body.lastname
	});
}

export const put_sdlp_report_split = (req, res) => {
	res.json({
		"firstname": req.body.firstname,
		"lastname": req.body.lastname
	});
}

export const delete_sdlp_report_split = (req, res) => {
	res.json({ "id": req.body.id });
}

export const get_sdlp_report_split_id = (req, res) => {
	res.json({ "id": req.params.id });
}