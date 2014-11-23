module.exports = function(wd){
	'use strict';
	return {
		input: {
			'open': function(url){
				return this.get(url);
			}
		},
		assertion: {
			'should have title "sideroad - Rich Web Application Development"': function(){
				return this.title()
				           .should.eventually.equal('sideroad - Rich Web Application Development');
			},
			'should have title "sideroad (sideroad)"': function(){
				return this.title()
				           .should.eventually.equal('sideroad (sideroad) · GitHuba');
			}
		}
	};
};
