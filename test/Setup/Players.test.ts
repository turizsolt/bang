import { expect } from 'chai';
import { Setup } from '../../src/Setup';
import { Device } from '../../src/Device';

describe('Setup', () => {
  it('basic user setup', () => {
    const setup = new Setup();
    setup.addUser("Zsiri", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    setup.addUser("Andi", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    expect(setup.getUserNames()).deep.equals(["Zsiri", "Andi"]);

    setup.removeUser("Zsiri");
    expect(setup.getUserNames()).deep.equals(["Andi"]);
  });

  it('claim', () => {
    const setup = new Setup();
    setup.addUser("Zsiri", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    setup.addUser("Andi", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    
    setup.claim("Zsiri", Device.Mobile, "123456789");
    expect(setup.isClaimed("Zsiri", Device.Mobile)).equals(true);
    expect(setup.isClaimed("Zsiri", Device.Desktop)).equals(false);
  });

  it('unclaim', () => {
    const setup = new Setup();
    setup.addUser("Zsiri", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    setup.addUser("Andi", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    
    setup.claim("Zsiri", Device.Mobile, "123456789");
    setup.claim("Zsiri", Device.Desktop, "987654321");
    setup.unclaim("Zsiri", Device.Mobile, "123456789");
    expect(setup.isClaimed("Zsiri", Device.Mobile)).equals(false);
    expect(setup.isClaimed("Zsiri", Device.Desktop)).equals(true);
  });

  it('kick', () => {
    const setup = new Setup();
    setup.addUser("Zsiri", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    setup.addUser("Andi", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    
    setup.claim("Zsiri", Device.Mobile, "123456789");
    setup.claim("Zsiri", Device.Desktop, "987654321");
    setup.kick("Zsiri");
    expect(setup.isClaimed("Zsiri", Device.Mobile)).equals(false);
    expect(setup.isClaimed("Zsiri", Device.Desktop)).equals(false);
  });

  it('cannot overclaim', () => {
    const setup = new Setup();
    setup.addUser("Zsiri", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    setup.addUser("Andi", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    
    setup.claim("Zsiri", Device.Mobile, "123456789");
    setup.claim("Zsiri", Device.Mobile, "987654321");
    expect(setup.whoClaimed("Zsiri", Device.Mobile)).equals("123456789");
  });

  it('can overclaim after unclaim', () => {
    const setup = new Setup();
    setup.addUser("Zsiri", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    setup.addUser("Andi", "https://cdn.pixabay.com/photo/2017/07/20/07/05/giraffe-2521453_960_720.png");
    
    setup.claim("Zsiri", Device.Mobile, "123456789");
    setup.unclaim("Zsiri", Device.Mobile, "123456789");
    setup.claim("Zsiri", Device.Mobile, "987654321");
    expect(setup.whoClaimed("Zsiri", Device.Mobile)).equals("987654321");
  });
});
