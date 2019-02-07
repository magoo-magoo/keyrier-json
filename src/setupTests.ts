import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

configure({ adapter: new EnzymeAdapter() });
const localStorageMock = {
  clear: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
};
(global as any).localStorage = localStorageMock;

(URL as any).createObjectURL = () => {
  //
};

(global as any).Worker = {};
