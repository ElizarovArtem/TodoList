(this["webpackJsonpit-incubator-todolist-ts"]=this["webpackJsonpit-incubator-todolist-ts"]||[]).push([[0],{100:function(t,e,a){t.exports=a(131)},105:function(t,e,a){},106:function(t,e,a){},131:function(t,e,a){"use strict";a.r(e);var r={};a.r(r),a.d(r,"selectIsLoggedIn",(function(){return Tt}));var n,s,o=a(0),i=a.n(o),c=a(9),d=a.n(c),u=(a(105),a(106),a(175)),l=a(176),p=a(177),f=a(168),m=a(133),b=a(173),h=a(179),v=a(180),g=a(178),I=a(15),k=a(7),y=a.n(k),C=a(13),E=a(80),j=a.n(E).a.create({baseURL:"https://social-network.samuraijs.com/api/1.1/",headers:{"API-KEY":"af2e12fe-a243-4dbc-9db5-644142644d59"},withCredentials:!0}),L=function(){return j.get("todo-lists")},x=function(t){return j.post("todo-lists",{title:t})},O=function(t){return j.delete("todo-lists/".concat(t))},w=function(t,e){return j.put("todo-lists/".concat(t),{title:e})},T=function(t){return j.get("todo-lists/".concat(t,"/tasks"))},S=function(t,e){return j.post("todo-lists/".concat(t,"/tasks"),{title:e})},A=function(t,e){return j.delete("todo-lists/".concat(t,"/tasks/").concat(e))},D=function(t,e,a){return j.put("todo-lists/".concat(t,"/tasks/").concat(e),a)},z=function(t){return j.post("auth/login",t)},M=function(){return j.delete("auth/login")},P=function(){return j.get("auth/me")};!function(t){t[t.New=0]="New",t[t.InProgress=1]="InProgress",t[t.Completed=2]="Completed",t[t.Draft=3]="Draft"}(n||(n={})),function(t){t[t.Low=0]="Low",t[t.Middle=1]="Middle",t[t.High=2]="High",t[t.Urgently=3]="Urgently",t[t.Later=4]="Later"}(s||(s={}));var N=a(14),B={setIsLoggedInAC:Object(N.b)("authAction/setIsLoggedIn")},F=Object(N.c)("app/initialized",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,P();case 2:return r=t.sent,t.prev=3,0===r.data.resultCode&&a.dispatch(B.setIsLoggedInAC({value:!0})),t.abrupt("return",{isInitialized:!0});case 8:return t.prev=8,t.t0=t.catch(3),t.abrupt("return",K(t.t0,a));case 11:case"end":return t.stop()}}),t,null,[[3,8]])})));return function(e,a){return t.apply(this,arguments)}}()),R={initializedTC:F},W=Object(N.d)({name:"app",initialState:{status:"idle",error:null,isInitialized:!1},reducers:{setAppStatusAC:function(t,e){t.status=e.payload.status},setAppErrorAC:function(t,e){t.error=e.payload.error}},extraReducers:function(t){t.addCase(F.fulfilled,(function(t,e){t.isInitialized=e.payload.isInitialized}))}}),q=W.reducer,U=W.actions,V=U.setAppStatusAC,H=U.setAppErrorAC,J=function(t,e){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return a&&e.dispatch(H({error:t.messages.length?t.messages[0]:"Some error occurred"})),e.dispatch(V({status:"failed"})),e.rejectWithValue({errors:t.messages,fields:t.fieldsErrors})},K=function(t,e){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return a&&e.dispatch(H({error:t.message})),e.dispatch(V({status:"failed"})),e.rejectWithValue({errors:[t.message],fields:void 0})},X=function(t){return t.app.status},Y=function(t){return t.app.isInitialized},$=Object(I.a)(Object(I.a)({},R),W.actions),_=$.setAppStatusAC,G=Object(N.c)("todoList/setTodoLists",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(_({status:"loading"})),t.prev=1,t.next=4,L();case 4:return r=t.sent,a.dispatch(_({status:"succeeded"})),t.abrupt("return",r.data);case 9:return t.prev=9,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 12:case"end":return t.stop()}}),t,null,[[1,9]])})));return function(e,a){return t.apply(this,arguments)}}()),Q=Object(N.c)("todoList/createTodoList",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(_({status:"loading"})),t.prev=1,t.next=4,x(e);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(_({status:"succeeded"})),t.abrupt("return",r.data.data.item);case 10:return t.abrupt("return",J(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),Z=Object(N.c)("todoList/deleteTodoList",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(st({todolistID:e,status:"loading"})),a.dispatch(_({status:"loading"})),t.next=4,O(e);case 4:if(r=t.sent,t.prev=5,0!==r.data.resultCode){t.next=11;break}return a.dispatch(_({status:"succeeded"})),t.abrupt("return",{todoListID:e});case 11:return t.abrupt("return",J(r.data,a));case 12:t.next=17;break;case 14:return t.prev=14,t.t0=t.catch(5),t.abrupt("return",K(t.t0,a));case 17:case"end":return t.stop()}}),t,null,[[5,14]])})));return function(e,a){return t.apply(this,arguments)}}()),tt=Object(N.c)("todoList/updateTodoList",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(_({status:"loading"})),t.prev=1,t.next=4,w(e.todolistId,e.title);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(_({status:"succeeded"})),t.abrupt("return",{todoListId:e.todolistId,title:e.title});case 10:return t.abrupt("return",J(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),et={setTodoListsTC:G,createTodoListsTC:Q,deleteTodoListsTC:Z,updateTodoListsTC:tt},at=Object(N.d)({name:"todoList",initialState:[],reducers:{changeTodoListFilterAC:function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.id}));a>-1&&(t[a].filter=e.payload.filter)},setTodoListsEntityStatusAC:function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.todolistID}));a>-1&&(t[a].entityStatus=e.payload.status)}},extraReducers:function(t){t.addCase(tt.fulfilled,(function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.todoListId}));a>-1&&(t[a].title=e.payload.title)})),t.addCase(Q.fulfilled,(function(t,e){t.unshift(Object(I.a)(Object(I.a)({},e.payload),{},{filter:"all",entityStatus:"idle"}))})),t.addCase(G.fulfilled,(function(t,e){return e.payload.map((function(t){return Object(I.a)(Object(I.a)({},t),{},{filter:"all",entityStatus:"idle"})}))})),t.addCase(Z.fulfilled,(function(t,e){var a=t.findIndex((function(t){return t.id===e.payload.todoListID}));a>-1&&t.splice(a,1)}))}}),rt=at.reducer,nt=at.actions,st=(nt.changeTodoListFilterAC,nt.setTodoListsEntityStatusAC),ot=$.setAppStatusAC,it=Object(N.c)("tasks/setTasks",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(ot({status:"loading"})),t.prev=1,t.next=4,T(e);case 4:return r=t.sent,a.dispatch(ot({status:"succeeded"})),t.abrupt("return",{tasks:r.data.items,todoLIstId:e});case 9:return t.prev=9,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 12:case"end":return t.stop()}}),t,null,[[1,9]])})));return function(e,a){return t.apply(this,arguments)}}()),ct=Object(N.c)("tasks/deleteTask",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(ot({status:"loading"})),a.dispatch(mt({taskId:e.taskId,status:"loading",todoLIstId:e.todoLIstId})),t.prev=2,t.next=5,A(e.todoLIstId,e.taskId);case 5:if(0!==(r=t.sent).data.resultCode){t.next=11;break}return a.dispatch(ot({status:"succeeded"})),t.abrupt("return",{taskID:e.taskId,todoListId:e.todoLIstId});case 11:return a.dispatch(mt({taskId:e.taskId,status:"failed",todoLIstId:e.todoLIstId})),t.abrupt("return",J(r.data,a));case 13:t.next=18;break;case 15:return t.prev=15,t.t0=t.catch(2),t.abrupt("return",K(t.t0,a));case 18:case"end":return t.stop()}}),t,null,[[2,15]])})));return function(e,a){return t.apply(this,arguments)}}()),dt=Object(N.c)("tasks/addTask",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(ot({status:"loading"})),t.prev=1,t.next=4,S(e.todoLIstId,e.title);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(ot({status:"succeeded"})),t.abrupt("return",r.data.data.item);case 10:return t.abrupt("return",J(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),ut=Object(N.c)("tasks/updateTask",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r,n,s,o;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=a.getState(),!(n=r.tasks[e.todoListId].find((function(t){return t.id===e.taskId})))){t.next=25;break}return s=Object(I.a)({title:n.title,deadline:n.deadline,description:n.description,priority:n.priority,startDate:n.startDate,status:n.status},e.domainModel),a.dispatch(mt({taskId:e.taskId,status:"loading",todoLIstId:e.todoListId})),a.dispatch(ot({status:"loading"})),t.prev=6,t.next=9,D(e.todoListId,e.taskId,s);case 9:if(o=t.sent,a.dispatch(mt({taskId:e.taskId,status:"idle",todoLIstId:e.todoListId})),0!==o.data.resultCode){t.next=16;break}return a.dispatch(ot({status:"succeeded"})),t.abrupt("return",{taskID:e.taskId,model:e.domainModel,todoListID:e.todoListId});case 16:return t.abrupt("return",J(o.data,a));case 17:t.next=23;break;case 19:return t.prev=19,t.t0=t.catch(6),a.dispatch(mt({taskId:e.taskId,status:"idle",todoLIstId:e.todoListId})),t.abrupt("return",K(t.t0,a));case 23:t.next=26;break;case 25:return t.abrupt("return",a.rejectWithValue("rejected"));case 26:case"end":return t.stop()}}),t,null,[[6,19]])})));return function(e,a){return t.apply(this,arguments)}}()),lt={setTasksTC:it,deleteTaskTC:ct,addTaskTC:dt,updateTaskTC:ut},pt=Object(N.d)({name:"tasks",initialState:{},reducers:{setTaskEntityStatusAC:function(t,e){var a=t[e.payload.todoLIstId].findIndex((function(t){return t.id===e.payload.taskId}));a>-1&&(t[e.payload.todoLIstId][a].entityStatus=e.payload.status)}},extraReducers:function(t){t.addCase(et.setTodoListsTC.fulfilled,(function(t,e){e.payload.forEach((function(e){t[e.id]=[]}))})),t.addCase(et.createTodoListsTC.fulfilled,(function(t,e){t[e.payload.id]=[]})),t.addCase(et.deleteTodoListsTC.fulfilled,(function(t,e){delete t[e.payload.todoListID]})),t.addCase(it.fulfilled,(function(t,e){t[e.payload.todoLIstId]=e.payload.tasks.map((function(t){return Object(I.a)(Object(I.a)({},t),{},{entityStatus:"idle"})}))})),t.addCase(dt.fulfilled,(function(t,e){t[e.payload.todoListId].unshift(Object(I.a)(Object(I.a)({},e.payload),{},{entityStatus:"idle"}))})),t.addCase(ct.fulfilled,(function(t,e){var a=t[e.payload.todoListId].findIndex((function(t){return t.id===e.payload.taskID}));a>-1&&t[e.payload.todoListId].splice(a,1)})),t.addCase(ut.fulfilled,(function(t,e){var a=t[e.payload.todoListID].findIndex((function(t){return t.id===e.payload.taskID}));a>-1&&(t[e.payload.todoListID][a]=Object(I.a)(Object(I.a)({},t[e.payload.todoListID][a]),e.payload.model))}))}}),ft=pt.reducer,mt=pt.actions.setTaskEntityStatusAC,bt=a(22),ht=a(170),vt=function(t){return t.app.error},gt=a(45),It=a(181),kt=a(169),yt=i.a.memo((function(t){var e=Object(o.useState)(""),a=Object(gt.a)(e,2),r=a[0],n=a[1],s=Object(o.useState)(null),c=Object(gt.a)(s,2),d=c[0],u=c[1],l=function(){var e=Object(C.a)(y.a.mark((function e(){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""===r.trim()){e.next=12;break}return e.prev=1,e.next=4,t.addItem(r.trim());case 4:n(""),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),u(e.t0.message);case 10:e.next=13;break;case 12:u("Title is required!");case 13:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(){return e.apply(this,arguments)}}();return i.a.createElement("div",null,i.a.createElement(It.a,{onChange:function(t){n(t.currentTarget.value)},onKeyPress:function(t){null!==d&&u(null),"Enter"===t.key&&l()},value:r,variant:"outlined",error:!!d,label:"Title",helperText:d,disabled:t.disabled}),i.a.createElement(f.a,{color:"primary",onClick:l,style:{marginLeft:"10px"},disabled:t.disabled},i.a.createElement(kt.a,null)))})),Ct=a(89),Et=i.a.memo((function(t){var e=t.disabled,a=void 0!==e&&e,r=Object(Ct.a)(t,["disabled"]),n=Object(o.useState)(!1),s=Object(gt.a)(n,2),c=s[0],d=s[1],u=Object(o.useState)(r.title),l=Object(gt.a)(u,2),p=l[0],f=l[1];return c&&!a?i.a.createElement(It.a,{value:p,autoFocus:!0,onBlur:function(){d(!1),p.trim()&&r.changeTitle(p.trim())},onChange:function(t){f(t.currentTarget.value)}}):i.a.createElement("span",{onDoubleClick:function(){return!a&&void d(!0)},style:{display:"inline-block",width:"70%"}},r.title)})),jt=a(185),Lt=a(182);function xt(t){return i.a.createElement(Lt.a,Object.assign({elevation:6,variant:"filled"},t))}function Ot(){var t=Object(bt.b)(),e=function(e,a){"clickaway"!==a&&t(H({error:null}))},a=Object(bt.c)(vt),r=null!==a;return i.a.createElement(jt.a,{open:r,autoHideDuration:6e3,onClose:e},i.a.createElement(xt,{onClose:e,severity:"error"},a))}var wt=a(17),Tt=function(t){return t.auth.isLoggedIn},St=a(186),At=a(167),Dt=a(171),zt=a(172),Mt=a(183),Pt=a(88),Nt=a(23),Bt=function(){return Object(bt.b)()};function Ft(t){var e=Bt();return Object(o.useMemo)((function(){return Object(Nt.b)(t,e)}),[])}var Rt=function(t){var e=t.demo,a=void 0!==e&&e,r=Bt(),n=Object(bt.c)((function(t){return t.auth.isLoggedIn})),s=Object(Pt.a)({initialValues:{email:"",password:"",rememberMe:!1},validate:function(t){var e={};return t.email||(e.email="Email is required"),t.password?t.password.length<3&&(e.password="Password is too short"):e.password="Password is required",e},onSubmit:function(){var t=Object(C.a)(y.a.mark((function t(e,n){var s,o;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a){t.next=7;break}return t.next=3,r(Kt.loginTC(e));case 3:s=t.sent,Kt.loginTC.rejected.match(s)&&s.payload&&(null===(o=s.payload.fields)||void 0===o?void 0:o.length)&&n.setFieldError(s.payload.fields[0].field,s.payload.fields[0].error),t.next=8;break;case 7:r(B.setIsLoggedInAC({value:!0}));case 8:case"end":return t.stop()}}),t)})));return function(e,a){return t.apply(this,arguments)}}()});return n?i.a.createElement(wt.a,{to:"/"}):i.a.createElement(ht.a,{container:!0,justify:"center"},i.a.createElement(ht.a,{item:!0,xs:3},i.a.createElement("form",{onSubmit:s.handleSubmit},i.a.createElement(St.a,null,i.a.createElement(At.a,null,i.a.createElement("p",null,"To log in get registered",i.a.createElement("a",{href:"https://social-network.samuraijs.com/",target:"_blank"},"here")),i.a.createElement("p",null,"or use common test account credentials:"),i.a.createElement("p",null,"Email: p0chta.testovaya@yandex.ru"),i.a.createElement("p",null,"Password: qwerty123")),i.a.createElement(Dt.a,null,i.a.createElement(It.a,{label:"Email",margin:"normal",name:"email",onBlur:s.handleBlur,value:s.values.email,onChange:s.handleChange}),s.touched.email&&s.errors.email?i.a.createElement("div",{style:{color:"red",textAlign:"center"}},s.errors.email):null,i.a.createElement(It.a,{type:"password",label:"Password",margin:"normal",name:"password",value:s.values.password,onChange:s.handleChange,onBlur:s.handleBlur}),s.touched.password&&s.errors.password?i.a.createElement("div",{style:{color:"red",textAlign:"center"}},s.errors.password):null,i.a.createElement(zt.a,{label:"Remember me",control:i.a.createElement(Mt.a,{name:"rememberMe",checked:s.values.rememberMe,onChange:s.handleChange})}),i.a.createElement(b.a,{type:"submit",variant:"contained",color:"primary"},"Login"))))))},Wt=$.setAppStatusAC,qt=Object(N.c)("auth/login",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(Wt({status:"loading"})),t.prev=1,t.next=4,z(e);case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(Wt({status:"succeeded"})),t.abrupt("return");case 10:return t.abrupt("return",J(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),Ut=Object(N.c)("auth/logout",function(){var t=Object(C.a)(y.a.mark((function t(e,a){var r;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.dispatch(Wt({status:"loading"})),t.prev=1,t.next=4,M();case 4:if(0!==(r=t.sent).data.resultCode){t.next=10;break}return a.dispatch(Wt({status:"succeeded"})),t.abrupt("return");case 10:return t.abrupt("return",J(r.data,a));case 11:t.next=16;break;case 13:return t.prev=13,t.t0=t.catch(1),t.abrupt("return",K(t.t0,a));case 16:case"end":return t.stop()}}),t,null,[[1,13]])})));return function(e,a){return t.apply(this,arguments)}}()),Vt={loginTC:qt,logoutTC:Ut},Ht=Object(N.d)({name:"auth",initialState:{isLoggedIn:!1},reducers:{},extraReducers:function(t){t.addCase(qt.fulfilled,(function(t,e){t.isLoggedIn=!0})),t.addCase(Ut.fulfilled,(function(t,e){t.isLoggedIn=!1})),t.addCase(B.setIsLoggedInAC,(function(t,e){t.isLoggedIn=e.payload.value}))}}),Jt=Ht.reducer,Kt=Object(I.a)({},Vt),Xt=(Ht.reducer,function(t){var e=t.demo,a=void 0!==e&&e,n=Object(bt.c)((function(t){return t.todoLists})),s=Object(bt.c)((function(t){return t.tasks})),c=Object(bt.c)(r.selectIsLoggedIn),d=Bt(),u=Ft(Qt).setTodoListsTC,l=function(){var t=Object(C.a)(y.a.mark((function t(e){var a,r,n;return y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d(Qt.createTodoListsTC(e));case 2:if(a=t.sent,!Qt.createTodoListsTC.rejected.match(a)){t.next=9;break}if(!(null===(r=a.payload)||void 0===r||null===(n=r.errors)||void 0===n?void 0:n.length)){t.next=8;break}throw new Error(a.payload.errors[0]);case 8:throw new Error("Some error occurred");case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(o.useEffect)((function(){!a&&c&&u()}),[]),c?i.a.createElement(i.a.Fragment,null,i.a.createElement(ht.a,{container:!0,style:{padding:"20px"}},i.a.createElement(yt,{addItem:l})),i.a.createElement(ht.a,{container:!0,spacing:5,style:{flexWrap:"nowrap",overflowX:"scroll"}},n.map((function(t){var e=s[t.id];return i.a.createElement(ht.a,{item:!0,key:t.id},i.a.createElement("div",{style:{width:"350px",position:"relative"}},i.a.createElement(Gt,{todolist:t,tasks:e,demo:a})))})))):i.a.createElement(wt.a,{to:"/login"})}),Yt=a(132),$t=a(174),_t=i.a.memo((function(t){var e=t.task,a=Ft(lt),r=a.deleteTaskTC,s=a.updateTaskTC,c=Object(o.useCallback)((function(t){s({taskId:e.id,todoListId:e.todoListId,domainModel:{status:t.currentTarget.checked?n.Completed:n.New}})}),[e.id,e.todoListId]),d=Object(o.useCallback)((function(t){s({taskId:e.id,todoListId:e.todoListId,domainModel:{title:t}})}),[e.id,e.todoListId]);return i.a.createElement("li",{className:e.status===n.Completed?"isDone":"",key:e.id,style:{position:"relative"}},i.a.createElement(Mt.a,{onChange:c,checked:e.status===n.Completed,color:"primary",disabled:"loading"===e.entityStatus}),i.a.createElement(Et,{title:e.title,changeTitle:d,disabled:"loading"===e.entityStatus}),i.a.createElement(f.a,{onClick:function(){r({taskId:e.id,todoLIstId:e.todoListId})},style:{position:"absolute",right:"0",top:"2px"},color:"primary",disabled:"loading"===e.entityStatus},i.a.createElement($t.a,{fontSize:"small"})))})),Gt=i.a.memo((function(t){console.log("TODOLIST");var e=Ft(lt),a=e.setTasksTC,r=e.addTaskTC,s=Ft(Qt),c=s.changeTodoListFilterAC,d=s.deleteTodoListsTC,u=s.updateTodoListsTC,l=Object(o.useCallback)(function(){var e=Object(C.a)(y.a.mark((function e(a){var n,s,o;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({title:a,todoLIstId:t.todolist.id});case 2:if(n=e.sent,!lt.addTaskTC.rejected.match(n)){e.next=9;break}if(!(null===(s=n.payload)||void 0===s||null===(o=s.errors)||void 0===o?void 0:o.length)){e.next=8;break}throw new Error(n.payload.errors[0]);case 8:throw new Error("Some error occurred");case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[t.todolist.id]);Object(o.useEffect)((function(){t.demo||a(t.todolist.id)}),[]);var p=Object(o.useCallback)((function(){d(t.todolist.id)}),[t.todolist.id]),m=Object(o.useCallback)((function(e){u({todolistId:t.todolist.id,title:e})}),[t.todolist.id]),h=t.tasks;"active"===t.todolist.filter&&(h=h.filter((function(t){return t.status===n.New}))),"completed"===t.todolist.filter&&(h=h.filter((function(t){return t.status===n.Completed})));var v=Object(o.useCallback)((function(e){c({id:t.todolist.id,filter:e})}),[t.todolist.id]),g=function(e,a){return i.a.createElement(b.a,{size:"small",variant:t.todolist.filter===e?"contained":"outlined",color:a,onClick:function(){return v(e)}},e.slice(0,1).toUpperCase()+e.slice(1))};return i.a.createElement(Yt.a,{elevation:3,style:{padding:"1px 20px 20px 20px"}},i.a.createElement("h3",null,i.a.createElement(Et,{title:t.todolist.title,changeTitle:m,disabled:"loading"===t.todolist.entityStatus}),i.a.createElement(f.a,{onClick:p,style:{position:"absolute",right:"5px",top:"4px"},disabled:"loading"===t.todolist.entityStatus},i.a.createElement($t.a,null))),i.a.createElement(yt,{addItem:l,disabled:"loading"===t.todolist.entityStatus}),i.a.createElement("ul",{style:{listStyleType:"none",padding:"0"}},h.map((function(t){return i.a.createElement(_t,{key:t.id,task:t})})),!h.length&&i.a.createElement("div",{style:{padding:"10px",color:"grey"}},"No tasks")),i.a.createElement("div",null,g("all","primary"),g("active","primary"),g("completed","primary")))})),Qt=Object(I.a)(Object(I.a)({},et),at.actions),Zt=(Object(I.a)(Object(I.a)({},lt),pt.actions),at.reducer,pt.reducer,i.a.memo((function(t){var e=t.demo,a=void 0!==e&&e,n=Object(bt.c)(X),s=Object(bt.c)(r.selectIsLoggedIn),c=Object(bt.c)(Y),d=Object(bt.b)();Object(o.useEffect)((function(){a||d($.initializedTC())}),[]);var I=Object(o.useCallback)((function(){d(a?B.setIsLoggedInAC({value:!1}):Kt.logoutTC())}),[]);return c?i.a.createElement("div",{className:"App"},i.a.createElement(l.a,{position:"static"},i.a.createElement(p.a,null,i.a.createElement(f.a,{edge:"start",color:"inherit","aria-label":"menu"},i.a.createElement(g.a,null)),i.a.createElement(m.a,{variant:"h6"},"News"),s&&i.a.createElement(b.a,{onClick:I,color:"inherit"},"Log Out"))),"loading"===n&&i.a.createElement(h.a,{color:"secondary",style:{display:"absolute"}}),i.a.createElement(v.a,{fixed:!0},i.a.createElement(wt.d,null,i.a.createElement(wt.b,{exact:!0,path:"/",render:function(){return i.a.createElement(Xt,{demo:a})}}),i.a.createElement(wt.b,{path:"/login",render:function(){return i.a.createElement(Rt,null)}}),i.a.createElement(wt.b,{path:"/404",render:function(){return i.a.createElement("h1",{style:{textAlign:"center"}},"404:Page not found")}}),i.a.createElement(wt.a,{from:"*",to:"/404"}))),i.a.createElement(Ot,null)):i.a.createElement("div",{style:{textAlign:"center",position:"fixed",top:"50%",width:"100%"}},i.a.createElement(u.a,{style:{width:"100px",height:"100px"}}))})));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var te=a(48),ee=Object(Nt.c)({todoLists:rt,tasks:ft,app:q,auth:Jt}),ae=Object(N.a)({reducer:ee,middleware:function(t){return t().prepend(te.a)}});window.store=ae;var re=a(47);d.a.render(i.a.createElement(re.a,null,i.a.createElement(bt.a,{store:ae},i.a.createElement(Zt,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[100,1,2]]]);
//# sourceMappingURL=main.8b72acd7.chunk.js.map