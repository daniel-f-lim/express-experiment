import { use, expect } from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);
const should = chai.should();

import server from '../server.js';


before((done) => {
	//Product.deleteMany({}, function(err) {});
	done();
})

after((done) => {
	//Product.deleteMany({}, function(err) {});
	done();
})


describe('/Server Login Test Collection', () => {
	it('root route', (done) => {
		chai.request.execute(server)
		.get('/')
		.end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});

	it('login route should send error if no email or no password', (done) => {
		chai.request.execute(server)
		.post('/login')
		.end((err, res) => {
			res.should.have.status(400);
			res._body.message.should.be.eql('Username and password are required');
			done();
		});
	});

	it('login route authenticate user', function(done) {
		this.timeout(4000);
		let data = {
			username: 'daniel',
			password: '12345'
		}
		chai.request.execute(server)
		.post('/login')
		.send(data)
		.end((err, res) => {
			res.should.have.status(200);
			res._body.message.should.be.eql('User daniel successful login');
			done();
		});
	});

	it('login route reject user not in db', (done) => {
		let data = {
			username: 'scott',
			password: 'password'
		}
		chai.request.execute(server)
		.post('/login')
		.send(data)
		.end((err, res) => {
			res.should.have.status(401);
			res._body.message.should.be.eql('User scott does not exist');
			done();
		});
	});

	it('login route reject user with bad password', (done) => {
		let data = {
			username: 'daniel',
			password: '54321'
		}
		chai.request.execute(server)
		.post('/login')
		.send(data)
		.end((err, res) => {
			res.should.have.status(401);
			res._body.message.should.be.eql('Bad username/password combination');
			done();
		});
	});

/*
	it('Should verify that we have 0 prudcts', (done) => {
		chai.request.execute(server)
		.get('/login')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.a('array');
			res.body.length.should.be.eql(0);
			done();
		})
	})

	it('Should test two values', () => {
		let expectedVal = 5;
		let actualVal = 5;

		expect(actualVal).to.be.equal(expectedVal);
	});
	*/
});