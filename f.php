<?php require_once(VIEW_PATH.'header.inc.php'); ?>

	
	<link href="<?php echo $url;?>assets/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<script src="<?php echo $url;?>assets/js/jquery.js"></script>
	<script src="<?php echo $url;?>assets/js/bootstrap.min.js"></script>
	<script src="<?php echo $url;?>assets/js/tooltip.js"></script>
	<script src="<?php echo $url;?>assets/js/angular.js"></script>

	<div class="container">
      <div class="row">
      	<aside ng-app="app" class="col-md-9 col-xs-11 p-l-2 p-t-2 main">
      		
			<div class="row">
				<div class="col-md-12">
					<H3><i class="fa fa-user" aria-hidden="true"></i> Listado de personas </H3>
				</div>
			</div>

			<br>
			<div class="row" ng-controller="view-Personas">
				<!-- div class="row">
				<div class="col-md-11">
					<button ng-click="add()" class="btn btn-success btn-sm" style="float: right;">Agregar persona</button>
				</div>
				</div -->
				<table class="table table-bordered">
				  <thead>
				    <tr>
				      <th>#</th>
				      <th>Nombre</th>
				      <th>Fecha</th>
				      <th><button ng-click="add()" class="btn btn-success btn-sm"><i class="fa fa-file-o" aria-hidden="true"></i></button>&nbsp;Nuevo</th>
				    </tr>
				  </thead>
				  <tbody>
				  		<tr ng-repeat="persona in personas track by $index">
				  			<td>{{ persona.id }}</td>
				  			<td>{{ persona.nombre }}</td>
							<td>{{ persona.fechaCreacion | limitTo:10 }}</td>
							<td></td>
								<button class="btn btn-primary btn-sm" ng-click="view(persona.id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button> &nbsp;
								<button class="btn btn-danger btn-sm" ng-click="delete(persona.id)" data-toggle='confirmation' data-singleton='true' data-placement='top'>  <i class="fa fa-times" aria-hidden="true"></i>Borrar</button>
							</td>
						</tr>
				  </tbody>
				</table>

				<!-- Modal -->
		        <div class="modal fade" id="contentModal" tabindex="-1" aria-hidden="true">
		            <div class="modal-dialog" role="document">
		                <div class="modal-content">
		                    <div class="modal-header"><h5 class="modal-title" id="title"></h5></div>
	                    <form ng-submit="submit()">
		                    <div class="modal-body">
		                        <div class="form-group row">
		                            <div id="personaId" class="col-md-3">
		                                <label>Id Persona</label>
		                                <input ng-model="persona.idPersona" class="form-control" disabled>
		                            </div>
		                            <div class="col-md-7">
		                                <label>Nombre</label>
		                                <input ng-model="persona.nombre" class="form-control" required>
		                            </div>
		                        </div>
		                        <div class="form-group row">
		                            <div class="col-md-11">
		                                <label>Dirección</label>
		                                <input ng-model="persona.direccion" class="form-control" required>
		                            </div>
		                        </div>
		                    </div>
		                    <div class="modal-footer">
		                        <button type="submit" class="btn btn-primary">
		                        <span class="glyphicon glyphicon-floppy-disk"></span> Guardar
		                        </button>
		                        <button class="btn btn-secondary" data-dismiss="modal">
		                        <span class="glyphicon glyphicon-remove"></span> Cancelar
		                        </button>
		                    </div>
		                   </form>
		                </div>
		            </div>
		        </div>
				<!-- Fin de la modal -->
			</div>
			
		</aside>
	  </div>
	</div>

<?php require_once(VIEW_PATH.'footer.inc.php'); ?>
<script src="<?php echo $url;?>personas.js"></script>