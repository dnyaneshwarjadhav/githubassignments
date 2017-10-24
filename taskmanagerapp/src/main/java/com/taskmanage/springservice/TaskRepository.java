package com.taskmanage.springservice;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

@RepositoryRestResource
public interface TaskRepository extends CrudRepository<Task, Integer> {

	List<Task> findByTaskStatus(@Param("status") String taskStatus);

	List<Task> findByTaskArchived(@Param("archivedfalse") int taskArchivedFalse);
	
	@Modifying
	@Transactional
	List<Task> deleteById(@Param("taskId") int taskId);
	
}
