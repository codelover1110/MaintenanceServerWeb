import React, { useEffect, Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CSVLink, CSVDownload } from 'react-csv';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { userService } from '../_services/user.service';



import { userActions } from '../_actions';
import { userConstants } from '../_constants';

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = items;
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};


function List({ match }) {
  const { path } = match;
  const users = useSelector(state => state.users);
  const user = useSelector(state => state.authentication.user);
  const dispatch = useDispatch();
  const [checkValue, setCheckValue] = useState('');
  const [usersData, setUsersData] = useState(null)
  const [tempUserData, setTempUserData] = useState(null)
  const { items, requestSort, sortConfig } = useSortableData(usersData);
  const [csvData, setCsvData] = useState([])
  const location = useLocation();

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  useEffect(() => {
    userService.getAll()
      .then((res) => {
        res.map((user, index) => {
          let convertString = JSON.parse(user.technical_authority)
          var resultString = ""
          convertString.map((item) => {
            resultString = resultString + item["label"] + ","
          })
          delete user.reset_time
          delete user.reset_id
          user.technical_authority = resultString
        })
        setTempUserData(res)
        if ((location.state) && location.state.detail != "") {
          const initialSearch = res.filter(x => ((x.user_name).toLowerCase()).includes((location.state.detail).toLowerCase()))
          setUsersData(initialSearch)
          setCsvData(initialSearch)
          setCheckValue(location.state.detail)
        } else {
          setUsersData(res)
          setCsvData(res)
        }
      })
  }, []);

  function handleDeleteUser(id) {
    confirmAlert({
      title: 'User Management',
      message: 'Are you sure to delete this user?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteConfirm(id)
        },
        {
          label: 'No',
          onClick: () => console.log("delete")
        }
      ]
    });

  }

  function deleteConfirm(id) {
    setUsersData(usersData.map(x => {
      if (x.id === id) { x.isDeleting = true; }
      return x;
    }));
    userService.delete(id).then(() => {
      setUsersData(usersData => usersData.filter(x => x.id !== id));
    });
  }


  function _handleInput(e) {
    if (e.target.value == '') {
      setUsersData(tempUserData)
    }
    setUsersData(tempUserData)
    setCheckValue(e.target.value);
    _handleRealtimeSearch(e.target.value);
  }

  function _handleRealtimeSearch(searchKey) {
    const filteredValue = usersData.filter(x => ((x.name).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.user_name).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.company).toLowerCase()).includes(searchKey.toLowerCase())
      || (x.phone).includes(searchKey) || ((x.email).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.user_authority).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.active).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.technical_authority).toLowerCase()).includes(searchKey.toLowerCase())
    )
    // const filteredValue = usersData.filter(x => (x.phone).includes(searchKey))
    // if (filteredValue.length > 0) {
    //   setUsersData(filteredValue)
    // }
    setUsersData(filteredValue)
    setCsvData(filteredValue)

  }

  function _handleKeydown(e) {
    setUsersData(tempUserData)

    if (e.key === 'Enter') {
      searchUser()
    }

  }

  function searchUser() {
    if (checkValue == '') {
      setUsersData(tempUserData)
      setCsvData(tempUserData)
      return
    }
    setUsersData(usersData => usersData.filter(x => (x.name).toLowerCase() == checkValue.toLowerCase() || (x.user_id) == checkValue || (x.user_name).toLowerCase() == checkValue.toLowerCase() || (x.company).toLowerCase() == checkValue.toLowerCase()
      || (x.phone) == checkValue || (x.email).toLowerCase() == checkValue.toLowerCase() || (x.user_authority).toLowerCase() == checkValue.toLowerCase() || (x.active).toLowerCase() == checkValue.toLowerCase() || (x.technical_authority).toLowerCase() == checkValue.toLowerCase()))
  }

  return (
    <div className="col-lg-12 adminpage-container">
      <div className="flex-container">
        <img src="/src/assets/user.png" className="title-image" />
        <h3 className="title-text">User Management</h3>
      </div>
      <div className="flex-space-around-container">
        <div>
          <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
          <button className="search-button" onClick={() => searchUser()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
        </div>
        <div>
          <CSVLink data={csvData} filename={"users.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
          <Link to={`${path}/add`} className="btn btn-sm btn-default mb-2"><i className="fa far fa-edit" style={{ fontSize: '20px' }}></i></Link>
        </div>
      </div>
      {users.loading && <em>Loading users...</em>}
      {users.error && <span className="text-danger">ERROR: {users.error}</span>}
      <table className="table table-hover">
        <thead>
          <tr>
            <th><button
              type="button"
              onClick={() => requestSort('user_name')}
              className={getClassNamesFor('user_name')}
            >User Name</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('name')}
              className={getClassNamesFor('name')}
            >Name</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('company')}
              className={getClassNamesFor('company')}
            >Company</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('phone')}
              className={getClassNamesFor('phone')}
            >Phone</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('email')}
              className={getClassNamesFor('email')}
            >Email</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('user_authority')}
              className={getClassNamesFor('user_authority')}
            >Authority</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('active')}
              className={getClassNamesFor('active')}
            >Active</button></th>
            <th><button
              type="button"
              onClick={() => requestSort('technical_authority')}
              className={getClassNamesFor('technical_authority')}
            >Technical Authority</button></th>
            <th><button>Action</button></th>
          </tr>
        </thead>
        {usersData &&
          <tbody>
            {usersData.map((user, index) =>
              <Fragment key={user.id}>
                <tr>
                  <td>{user.user_name}</td>
                  <td>{user.name}</td>
                  <td>{user.company}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.user_authority}</td>
                  <td>{user.active}</td>
                  <td>{user.technical_authority}</td>
                  <td>
                    <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary mr-1 edit-button">Edit</Link>
                  </td>
                </tr>
              </Fragment>
            )}
          </tbody>
        }
      </table>
    </div>
  );
}

export { List };