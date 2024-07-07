const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test("test1: Create an issue with every field",()=>{
        chai
            .request(server)
            .post('/api/issues/project1')
            .send({
                issue_title:'issue1',
                issue_text:'text for issue1',
                created_by:'user1',
                assigned_to:'someone',
                status_text:'something goes here',
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.equal(res.type,'application/json')
                assert.equal(res.body.issue_title,'issue1')
                assert.equal(res.body.issue_text, "text for issue1")
                assert.equal(res.body.created_by, "user1")
                assert.equal(res.body.assigned_to, "someone")
                assert.equal(res.body.status_text, "something goes here")
                assert.equal(res.body.open, true)
            })
    })
    
    test("test2: Create an issue with only required fields:", () => {
      chai
        .request(server)
        .post("/api/issues/project1")
        .send({
          issue_title: "issue2",
          issue_text: "text for issue2",
          created_by: "user2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type,'application/json')
          assert.equal(res.body.issue_title, "issue2")
          assert.equal(res.body.issue_text, "text for issue2")
          assert.equal(res.body.created_by, "user2")
          assert.equal(res.body.assigned_to, "")
          assert.equal(res.body.status_text, "")
          assert.equal(res.body.open, true)
        })
    })

    test("test3: Create an issue with missing required fields:", () => {
      chai
        .request(server)
        .post("/api/issues/project1")
        .send({
          issue_title: "issue2",
          issue_text: "text for issue2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "required field(s) missing")
        })
    })

    test("test4: View issues on a project:", () => {
      chai
        .request(server)
        .get('/api/issues/project1')
        .end((err,res)=>{
            assert.equal(res.status,200)
            assert.equal(res.type,'application/json')
        })
    })

    test("test5: View issues on a project with one filter:", () => {
      chai
        .request(server)
        .get("/api/issues/project1?issue_title=issue1")
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
        })
    })

    test("test6: View issues on a project with multiple filters:", () => {
      chai
        .request(server)
        .get("/api/issues/project1?issue_title=issue1&open=true")
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
        })
    })

    test("test7: Update one field on an issue:", () => {
      chai
        .request(server)
        .put('/api/issues/project1')
        .send({
            _id:'668a910c58e78562dbbe04c3',
            issue_text:'updated text for issue1'
        })
        .end((err,res)=>{
            assert.equal(res.status,200)
            assert.equal(res.type,'application/json')
            assert.equal(res.body.result, "successfully updated")
            assert.equal(res.body._id, "668a910c58e78562dbbe04c3")
        })
    })

    test("test8: Update multiple fields on an issue:", () => {
      chai
        .request(server)
        .put("/api/issues/project1")
        .send({
          _id: "668a910c58e78562dbbe04c3",
          issue_text: "updated text for issue1 for the second time",
          assigned_to: "someone for issue1",
          status_text: "here goes status text for issue1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.result, "successfully updated")
          assert.equal(res.body._id, "668a910c58e78562dbbe04c3")
        })
    })

    test("test9: Update an issue with missing _id:", () => {
      chai
        .request(server)
        .put("/api/issues/project1")
        .send({
          issue_text: "updated text for issue1 for the third time",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "missing _id")
        })
    })

    test("test10: Update an issue with no fields to update:", () => {
      chai
        .request(server)
        .put("/api/issues/project1")
        .send({
          _id: "668a910c58e78562dbbe04c3",
          issue_text: "",
          issue_title:''
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "no update field(s) sent")
          assert.equal(res.body._id, "668a910c58e78562dbbe04c3")
        })
    })

    test("test11: Update an issue with an invalid _id:", () => {
      chai
        .request(server)
        .put("/api/issues/project1")
        .send({
          _id: "668a856a8fb41871dd49082a",
          issue_text: "something....",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "could not update")
          assert.equal(res.body._id, "668a856a8fb41871dd49082a")
        })
    })

    test("test12: Delete an issue:", () => {
      chai
        .request(server)
        .delete("/api/issues/project1")
        .send({
          _id: "668a911e58e78562dbbe04c8",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.result, "successfully deleted")
          assert.equal(res.body._id, "668a911e58e78562dbbe04c8")
        })
    })

    test("test13: Delete an issue with an invalid _id:", () => {
      chai
        .request(server)
        .delete("/api/issues/project1")
        .send({
          _id: "668a856a8fb41871dd49082a",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "could not delete")
          assert.equal(res.body._id, "668a856a8fb41871dd49082a")
        })
    })

    test("test14: Delete an issue with missing _id:", () => {
      chai
        .request(server)
        .delete("/api/issues/project1")
        .send({
          _id: "",
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.equal(res.body.error, "missing _id")
        })
    })
});
