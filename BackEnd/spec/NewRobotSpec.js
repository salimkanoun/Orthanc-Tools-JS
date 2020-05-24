const {Robot, robot} = require('../model/robot/Robot')

describe('Robot Singleton', () => {

    it('should return robot singleton', ()=>{
        expect(robot).toBeInstanceOf(Robot)
    })
    


})